import { LightningElement,api,track } from 'lwc';
import createIssue from '@salesforce/apex/LiabrarySecond.createIssue';
import isCopyAvailable from '@salesforce/apex/LiabrarySecond.isCopyAvailable';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class LiabraryissueBook extends LightningElement {
    @api issuebookrecord;
//id from liabrary management
@api bookid;
    @track bookName;
    @track readerName;
    @track tentativeDate;
    @track showcharge;
    //@track showdata=true;
 
    @track validDate;
    @track buttonDisable;
    bookdetails;
    availablebooks;
    priceBook;
    nameOftheBook;

    @track disableReader;
   @track paycharge;

    connectedCallback(){

        console.log('Coming from management :',this.bookid);
       
        this.bookName=this.bookid;
        this.disableinput(this.bookName);

        this.bookid='';
        const selectedEvent = new CustomEvent("bookidblack", {
            detail: this.bookid
          });
      
          this.dispatchEvent(selectedEvent);
        
    }



    handelChange(event){

         if(event.target.fieldName==='Book__c'){
            this.bookName=event.target.value;
            console.log('BookId:',this.bookName);
            this.disableinput(event.target.value);
            
        }
        else if(event.target.fieldName==='Reader_Name__c'){
            this.readerName=event.target.value;
            console.log('ReaderId:', this.readerName);
        }
        else if(event.target.fieldName==='Tentative_Date_of_Return__c'){
            this.tentativeDate=event.target.value;
            console.log('Date:', this.tentativeDate);
            this.calculatePayCharge();
        }


        console.log('Input name:',event.target.fieldName);
        console.log('Input value:',event.target.value);
        console.log('BookId:',this.bookName);
        console.log('ReaderId:', this.readerName);
        console.log('Date:', this.tentativeDate);
    }



    // get options() {
    //     return [
    //         { label: 'ISBN Number', value: 'isbn' },
    //         { label: 'Book Name', value: 'bookName' },
    //     ];
    // }

    // comboChange(event) {
    //     this.value = event.detail.value;
    //     console.log('value :',this.value);
    // }









    disableinput(bookrecId){
        isCopyAvailable({bookrecId:bookrecId})
                .then(result=>{
                    console.log('Book details:',result);
                    this.bookdetails=result;
                    console.log('Available book:',this.bookdetails.Number_of_Free_Books__c);
                    this.priceBook=this.bookdetails.Price__c;
                    console.log('Price book:', this.priceBook);
                    this.nameOftheBook=this.bookdetails.Name;
                    this.availablebooks=this.bookdetails.Number_of_Free_Books__c;
                    if( this.availablebooks ===0){
                        this.disableReader=true;
                        this.readerName='';
                    }
                    else{
                        this.disableReader=false;
                    }

                })
    }






    calculatePayCharge(){
        
        console.log('tentative date:', this.tentativeDate);
        console.log('price of the book',this.priceBook);

        //for current Date
        let rightNow = new Date();

        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        console.log('Todays Date:',yyyyMmDd);

        if(this.tentativeDate < yyyyMmDd){
            this.buttonDisable=true;
           this.validDate=true;
           this.showcharge=false;
            
        }
        else{
            this.buttonDisable=false;
            this.showcharge=true;
            this.validDate=false;
        }
       
    //Difference between two date 
      var date1=new Date(yyyyMmDd); 
      var date2=new Date(this.tentativeDate);

      var timeDiffrence = Math.abs(date2.getTime() - date1.getTime());
      var differDays = Math.ceil(timeDiffrence / (1000 * 3600 * 24)); 
        console.log('inside diff date:'+differDays);
       
        //calculate pay charge
        
       this.paycharge=(differDays*this.priceBook*2.5)/100;
       console.log('paycharge',this.paycharge);


    }

    saveIssue(){

      if(this.tentativeDate==null){
          alert('Please Enter Valid Tentative Date');
      }

      else{
        createIssue({bookId:this.bookName,readerId:this.readerName,tentativeDate:this.tentativeDate,paychargeRs:this.paycharge})
        .then(result=>{
            console.log('FirstCopyList',result);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message:'Issue '+ this.nameOftheBook+' Book Successfully',
                    variant: 'success',
                }),
            ); 
            this.readerName='';
            this.bookName='';
            this.tentativeDate='';
            this.showcharge=false;
           
           // this.showdata=false;
     
        })
       
       .catch(error => {
        console.log('Error:',error.message);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error',
                variant: 'error',
            }),
        );
       
    });

    }
    }
}