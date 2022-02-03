public with sharing class LiabrarySecond {
   

    // Issue any book by reader name on Ui
    @AuraEnabled
    public static List<Book_Copy__c> createIssue(ID bookId,ID readerId,Date tentativeDate,Decimal paychargeRs){
        try {
            List<Book_Copy__c> copiesbook = new List<Book_Copy__c>();
            if(Book_Copy__c.SObjectType.getDescribe().isAccessible() ){
               copiesbook =[Select ID,Book__c,Issued__c from Book_Copy__c where Book__c=:bookId AND Issued__c=False ];
            }

            System.debug(copiesbook[0].Id);
            List<Book_Copy__c> updateChecked =new List<Book_Copy__c>();
            List<Issue__c> insertList =new List<Issue__c>();
            if(!copiesbook.isEmpty()){
            Issue__c newissue = new Issue__c();
            newissue.Book__c=bookId;
            newissue.Reader_Name__c=readerId;
            newissue.Book_Copy__c=copiesbook[0].Id;
            newissue.Tentative_Date_of_Return__c=tentativeDate;
            newissue.Pay_Charge__c=paychargeRs;
            insertList.add(newissue);

            }
            if(Issue__c.SObjectType.getDescribe().isAccessible() && Issue__c.sObjectType.getDescribe().isCreateable() && Issue__c.sObjectType.getDescribe().isUpdateable() )
            {
               
            insert insertList;
            }

        
            List<Book_Copy__c> checkedBook = new  List<Book_Copy__c>();
            if(Book_Copy__c.SObjectType.getDescribe().isAccessible() ){
                checkedBook= [Select Id, Issued__c from Book_Copy__c where ID=:copiesbook[0].Id];
            }
            for(Book_Copy__c  c:checkedBook){
                if(c.Issued__c==False){
                c.Issued__c=True;

                updateChecked.add(c);
                }
            }
            if(Book_Copy__c.SObjectType.getDescribe().isAccessible() && Book_Copy__c.sObjectType.getDescribe().isCreateable() && Book_Copy__c.sObjectType.getDescribe().isUpdateable() )
            {
            update updateChecked;
            }
            
            return copiesbook;
               
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }









    //get no of available book (if there is no available copy for that particular book then disable reader input)

    @AuraEnabled
    public static Book__c isCopyAvailable(ID bookrecId){
        try {
            Book__c avalibleBook = new Book__c();
            if(bookrecId !=null && Book__c.SObjectType.getDescribe().isAccessible() ){
                avalibleBook=[Select Id,Name,Number_of_Free_Books__c,Number_Of_Issued_Book__c,Price__c from Book__c where Id=:bookrecId];
            }
            return avalibleBook;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }





    //get all issue book with reader name (Cmp-6)
    @AuraEnabled
    public static List<Issue__c> issueBookwithReader(){ 
        try {
            List<Issue__c> issueList = new List<Issue__c>();
            issueList=[Select Id,Book__c,Book__r.Name,From_Date__c,Reader_Name__r.Name,To_Date__c,Tentative_Date_of_Return__c,Book_Copy__r.Id,Book_Copy__r.Name from Issue__c];
            return issueList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }






    @AuraEnabled
    public static  List<Contact>  customerName(){
        try {
            List<Contact>  customerList= new List<Contact>();
            List<Contact>  conList=[Select Id, Name,(Select Book__r.Name,Book__c,Reader_Name__c,Tentative_Date_of_Return__c,To_Date__c from Issue__r where Reader_Name__c!=null) from Contact];
            for(Contact con:conList ){
                if(!con.Issue__r.isEmpty()){
                    customerList.add(con);
                    System.debug(con.Name);
                }
            }
            return customerList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



    
    // public class CustomerDetails(){
    //     @AuraEnabled public string Name{get;set;}
    //     @AuraEnabled public Number NumberOfBook{get;set;}
    //     @AuraEnabled public string  OverdueBook{get;set;}
            
        
    // }





}
