import { LightningElement ,track} from 'lwc';
import customerName from '@salesforce/apex/LiabrarySecond.customerName'

export default class CustomerIssuedbook extends LightningElement {


    @track customerList;
//    @track overdue;
   todaydate;
  @track bookList;


    connectedCallback(){
        customerName()
            .then(result=>{
                this.customerList=this.processData(result);;
              //  this.bookList=this.processData(result);
                console.log('customer Name:',JSON.stringify(this.customerList));
                console.log('Issue Name:',JSON.stringify(this.customerList[0].Issue__r));
                console.log('Issue size:',this.customerList[0].Issue__r.length);
                console.log('Books are:',this.bookList);
              

            })
        

    }




    processData(data){
        let newData = [];
        this.todayDate();
        data.forEach(currentItem => {
            currentItem.Issue__r.forEach(item=>{
                if( item.Tentative_Date_of_Return__c< this.todaydate  && item.To_Date__c ==null){
                    item.overdue = true;   
                    }
                  
        });
        newData.push(currentItem);
    });
        return newData;
   
}







    todayDate(){
        let rightNow = new Date();

        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        this.todaydate=yyyyMmDd;
        console.log(yyyyMmDd);

    }


}