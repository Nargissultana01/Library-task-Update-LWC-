import { LightningElement,track,api } from 'lwc';

export default class LibraryManagement extends LightningElement {
@track activeTab;
@track searchbook;
@track addbook;
@track issuebook;
@track bookreader;
@track listofissuebook;
@track customerissue;
@api bookrecordId;
@api bookrecord;



    handleActive(event){
        console.log('label Name:',event.target.label);
        if(event.target.label=='Search Book'){
        this.searchbook=true;
        this.addbook=false;
        this.issuebook=false;
        this.bookreader=false;
        this.listofissuebook=false;
        this.customerissue=false;
        this.activeTab='';
        }
        else if(event.target.label=='Add Book'){
        this.addbook=true;
        this.searchbook=false;
        this.issuebook=false;
        this.bookreader=false;
        this.listofissuebook=false;
        this.customerissue=false;
        this.activeTab='';
        
        }
        else if(event.target.label=='Issue Book'){
            this.issuebook=true;
            this.searchbook=false; 
            this.addbook=false;
            this.bookreader=false;
            this.listofissuebook=false;
            this.customerissue=false;
            this.activeTab='';
           
        }
        else if(event.target.label=='Book Info'){
            this.issuebook=false;
            this.searchbook=false; 
            this.addbook=false;
            this.bookreader=true;
            this.listofissuebook=false;
            this.customerissue=false;
            this.activeTab='';
        }
        else if(event.target.label=='List Of Issue Book'){
            this.issuebook=false;
            this.searchbook=false; 
            this.addbook=false;
            this.bookreader=false;
            this.customerissue=false;
            this.listofissuebook=true;
            this.activeTab='';
        }
        else if(event.target.label=='Customer'){
            this.issuebook=false;
            this.searchbook=false; 
            this.addbook=false;
            this.bookreader=false;
            this.listofissuebook=false;
            this.customerissue=true;
            this.activeTab='';
        }
    }


    
    hanldeProgressValueChange(event) {
        
        this.bookrecordId = event.detail;
        console.log('Management tab:', this.bookrecordId);
        if(this.activeTab!='4'){
        this.activeTab='4';
        }
    }


    handelchangevalue(event){
        this.bookrecord = event.detail;
        if(this.activeTab!='3'){
            this.activeTab='3';
        }


    }

    idblank(event){
        this.bookrecord = event.detail;

    }

    issueBook(event){
        this.bookrecordId = event.detail;
        console.log('Management tab:', this.bookrecordId);
        if(this.activeTab!='4'){
        this.activeTab='4';
        }

    }

  


}