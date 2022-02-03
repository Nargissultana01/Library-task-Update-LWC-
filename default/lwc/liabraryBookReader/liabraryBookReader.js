import { LightningElement,api,track,wire } from 'lwc';
import readerNameDate from '@salesforce/apex/Liabrary.readerNameDate';
import getreturnSelectedBook from '@salesforce/apex/Liabrary.getreturnSelectedBook';
import updateUI from '@salesforce/apex/Liabrary.updateUI';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import SaveBookRecord from '@salesforce/apex/Liabrary.saveBookRecord';
import returnDateUpdate from '@salesforce/apex/Liabrary.returnDateUpdate';

export default class LiabraryBookReader extends LightningElement {
    @track bookName;
    @track availablebook;
    @track issuebook;
    @track isbn;
    @api bookrecord;
    @track bookList;
    readerName;
    @track readerName;
    @track addNumberOfBook;
    @track numberofbooks;
    //show return,back and damaged book
    @track bookIsBack;
    @track message;
    todaydate;
    dateList;

    //child Component
    @track readerVisible = false;
    @api bookrecordId;


    @api activeTab;
   


    
    
    
    // @wire(getreturnSelectedBook,{bookRecordId:'$bookrecord'})
    // wiredBookList({data,error}){
    //     if(data) {
    //         console.log('Data is:',data);
    //             this.bookList=data;
    //             console.log('Data is:',this.bookList);
    //             console.log('BookName is:',this.bookList.Name);
    //             this.bookName=this.bookList.Name;
    //             this.availablebook=this.bookList.Number_of_Free_Books__c;
    //             this.issuebook=this.bookList.Number_Of_Issued_Book__c;
    //             this.isbn=this.bookList.ISBN_Number__c;
	// 		this.error = undefined;
    //         this.connectedCallback();
	// 	}else {
	// 		this.bookList =undefined;
	// 		this.error = error;
	// 	}

    // }



    connectedCallback(){
        readerNameDate({bookRecordId:this.bookrecord})
        .then(result=>{
            console.log('Reader  Name with to date result is:',result);
            this.readerName=this.processData(result);
            console.log('Reader  Name with to date is:', JSON.stringify(this.readerName));

        })


        getreturnSelectedBook({bookRecordId:this.bookrecord})
        .then(result => {
            console.log('result is:',result);
            this.bookList=result;
            console.log('result is:',this.bookList);
            console.log('BookName is:',this.bookList.Name);
            this.bookName=this.bookList.Name;
            this.availablebook=this.bookList.Number_of_Free_Books__c;
            this.issuebook=this.bookList.Number_Of_Issued_Book__c;
            this.isbn=this.bookList.ISBN_Number__c;
    
    
        })


    }


    processData(data){
        let newData = [];
        data.forEach(currentItem => {
            if( currentItem.To_Date__c !=null){
            currentItem.bookIsBack = false;
            }
            else{
                currentItem.bookIsBack = true;
            }
            newData.push(currentItem);
            
        });
        return newData;
    }


    


   

// SomeOne want to issue book
    issueBook(event){
        this.readerVisible=true;
        this.bookrecordId=this.bookrecord;
    console.log('Record Id ',this.bookrecord);

    const selectedEvent = new CustomEvent("progressvalue", {
      detail: this.bookrecordId
    });

    this.dispatchEvent(selectedEvent);
    }


    addBook(){
        this.addNumberOfBook=true;
    }
//Close Pop up
    closePopUp(){
        this.addNumberOfBook=false;
    }

    //input how many book to add
    handlechange(event){
        this.numberofbooks=event.target.value;
        console.log('No Of Copies:',this.numberofbooks);

    }

    



    changevalueInUi(){
        updateUI({bookRecordId:this.bookrecord})
        .then(result=>{
            console.log('Update record:',result);
            this.bookList=result;
                console.log('Result is:',this.bookList);
                console.log('BookName is:',this.bookList.Name);
                //this.bookName=this.bookList.Name;
                this.availablebook=this.bookList.Number_of_Free_Books__c;
                this.issuebook=this.bookList.Number_Of_Issued_Book__c;
               // this.isbn=this.bookList.ISBN_Number__c;
        })


       

        

    }






//Add Book copies

    handleSave(){
        console.log('isbn:',this.isbn);
        SaveBookRecord({isbnnumber:this.isbn , numberOfCopies:this.numberofbooks})
        .then((result) => {
           
            console.log('Record Created:', JSON.stringify(result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: this.numberofbooks+' copies added to '+ this.bookList.Name +' Successfully',
                    variant: 'success',
                }),
            ); 
            this.changevalueInUi();
            this.addNumberOfBook=false;
           
        })
        .catch(error => {
            console.log('Error:',error.body.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.message,
                    variant: 'error',
                }),
            );
           
        });
        
    }



    // Return,Lost Damaged button
    backBook(event){
        this.readerName.forEach(currentItem => {
            if(event.currentTarget.dataset.recid === currentItem.Id){
                currentItem.bookIsBack = false;
            }
        });

            


       // this.bookIsBack=false;
        this.message=event.target.label;
        console.log('readerName record:',this.readerName[event.target.accessKey]);
        console.log('readerName get book copies id:',this.readerName[event.target.accessKey].Book_Copy__r.Id);
        console.log('Issue Person Id:',this.readerName[event.target.accessKey].Id);

        let rightNow = new Date();

        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        this.todaydate=yyyyMmDd;
        console.log(yyyyMmDd);
        console.log('this.todaydate:',this.todaydate);
       


        returnDateUpdate({todate:yyyyMmDd,copyRecordId:this.readerName[event.target.accessKey].Book_Copy__r.Id,issueRecordId:this.readerName[event.target.accessKey].Id})
        .then(result=>{
            console.log('Updated date:',result);
            this.dateList=result;
            this.changevalueInUi();
            this.connectedCallback();
           

        })
        
       


    }

   


   
}









 
    // connectedCallback() {
    // returnSelectedBook({bookRecordId:this.bookrecord})
    // .then(result => {
    //     console.log('result is:',result);
    //     this.bookList=result;
    //     console.log('result is:',this.bookList);
    //     console.log('BookName is:',this.bookList.Name);
    //     this.bookName=this.bookList.Name;
    //     this.availablebook=this.bookList.Number_of_Free_Books__c;
    //     this.issuebook=this.bookList.Number_Of_Issued_Book__c;
    //     this.isbn=this.bookList.ISBN_Number__c;


    // })
    // .catch(error => {
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //             title: 'Error',
    //             message: error.message,
    //             variant: 'error',
    //         }),
    //     );
    // });
    // }

    //for readername
    // @wire(readerNameDate,{bookRecordId:'$bookrecord'})
    // readerName({data,error}){
    //     if(data){
    //         console.log('Reader  Name is:',data);
    //         this.readerName=data;
    //         console.log('Reader  Name is:',this.readerName);
    //         this.error = undefined;
    //     }else {
			
	// 		this.error = error;
	// 	}

    // }
