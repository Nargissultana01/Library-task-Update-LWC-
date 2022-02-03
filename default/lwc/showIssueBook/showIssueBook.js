import { LightningElement,track,api } from 'lwc';
import issueBookwithReader from '@salesforce/apex/LiabrarySecond.issueBookwithReader';
import returnDateUpdate from '@salesforce/apex/Liabrary.returnDateUpdate';

export default class ShowIssueBook extends LightningElement {

    @track issuebook;
    @api issuebookId;
    todaydate;
    @track rowSelected;
    tentative;

     //For pagination
    @track page = 1;
    @track startingRecord = 1; 
    @track endingRecord = 0; 
    @track pageSize =5; 
    @track totalRecountCount = 0; 
    @track totalPage = 0;
    @track item = [];



    connectedCallback(){
        issueBookwithReader()
        .then(result=>{




            this.item = this.processdata(result);
            this.totalRecountCount = result.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
    
            this.issuebook = this.item.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
    
          //  this.issuebook=this.processdata(result);
            console.log('List of all issue',JSON.stringify(this.issuebook));
              })

    }



    processdata(data){

       

        let newlist=[];
        this.todayDate();
        console.log('Todays Date:',this.todaydate);
        data.forEach(currentItem => {
            this.tentative=currentItem.Tentative_Date_of_Return__c;
            this.differencedate();
            if( currentItem.To_Date__c ==null){
            currentItem.bookIsBack = true;
            
            }
            if(currentItem.Tentative_Date_of_Return__c< this.todaydate && currentItem.To_Date__c ==null){

                currentItem.rowSelected = 'red-color'
            }
            else if(this.differdate<=2 && currentItem.To_Date__c ==null){
                currentItem.rowSelected ='orange-color';
            }
            else{
                currentItem.rowSelected ='';
            }
            newlist.push(currentItem);
            
        });
        return newlist;
    }



    todayDate(){
        //todays date
        let rightNow = new Date();

        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        this.todaydate=yyyyMmDd;
        console.log(yyyyMmDd);

    }



    

    // difference between today's date and tentative date
    differencedate(){
    var date1=new Date(this.todaydate); 
    var date2=new Date(this.tentative);

    var timeDiffrence = Math.abs(date2.getTime() - date1.getTime());
    var differDays = Math.ceil(timeDiffrence / (1000 * 3600 * 24)); 
        console.log('inside diff date:'+differDays);
    this.differdate=differDays;
    console.log('DifferDate:',this.differdate);
    }




     //For pagination start

     previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
    
    
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }
    
    
    displayRecordPerPage(page){
        
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
    
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
    
        this.issuebook = this.item.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        
    
    }
    
    
    get disablePrev(){
        if(this.page===1){
    return true;
        }else{
        return false;
        }
    }
    
    
    get disableNext(){
        if(this.page===this.totalPage||this.totalPage===0){
        return true;
    
        }
        else{
        return false;
        }
    
    }








    backBook(event){
        this.issuebookId=this.issuebook[event.target.accessKey].Book__r.Id;

       
       


        let rightNow = new Date();

        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        this.todaydate=yyyyMmDd;
        console.log(yyyyMmDd);
        console.log('this.todaydate:',this.todaydate);
       


        returnDateUpdate({todate:yyyyMmDd,copyRecordId:this.issuebook[event.target.accessKey].Book_Copy__r.Id,issueRecordId:this.issuebook[event.target.accessKey].Id})
        .then(result=>{
            console.log('Updated date:',result);
            this.dateList=result;
            this.returnbookInfo();


           

        })
        
    }





    returnbookInfo(){
        const selectedEvent = new CustomEvent("progressvalue", {
            detail: this.issuebookId
          });
      
          this.dispatchEvent(selectedEvent);
          

    }
}