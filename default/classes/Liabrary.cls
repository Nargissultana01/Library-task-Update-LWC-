public with sharing class Liabrary {


    //Save particular Books Record if same isbn no book is there then don't save
    @AuraEnabled
    public static List<Book__c> saveBookRecord(Book__c  bookRecord, String isbnnumber ,Integer numberOfCopies){
        try{

            if(Book__c.SObjectType.getDescribe().isAccessible()){
                List<Book__c> isbnlist= new List<Book__c>();
                isbnlist= [Select ISBN_Number__c from Book__c where ISBN_Number__c =: isbnnumber];
               // System.debug('isbn number'+bookRecord.ISBN_Number__c);
                if(isbnlist.isEmpty()){
                    insert bookRecord;
                    
                }
        
                Book__c idset =[Select ID from Book__c where ISBN_Number__c =: isbnnumber ];
                List<Book__c> bookId=[Select ID,ISBN_Number__c, Name from Book__c where ISBN_Number__c =: isbnnumber ];
        
                List<Book_Copy__c> copiesbook =new List<Book_Copy__c>();
                for(Integer i=0;i<numberOfCopies;i++){
                    Book_Copy__c copy=new Book_Copy__c();
                    copy.Book__c=idset.Id;
                    copiesbook.add(copy);
                }
                insert copiesbook;
            }
            List<Book__c> bookList=[Select Name,ISBN_Number__c,Price__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c];
            return bookList;
           
            
          
        } catch (Exception e) {
            System.debug('Line Number'+e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
            
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //Get  books Record which are have same ISBN number
    
    @AuraEnabled
    public static List<Book__c> getAllbook(String isbnnumber ){
        try {
            String key = '%' +  isbnnumber + '%';
            List<Book__c> bookList=[Select Name,ISBN_Number__c,Author__c,Price__c,Number_Of_Books__c from Book__c where ISBN_Number__c LIKE: key];
        return bookList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    





    //Get all book 
    @AuraEnabled
    public static List<Book__c>  allBookRecordToShow(){
        try {
            List<Book__c> bookList=[Select Name,ISBN_Number__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c,Price__c,Number_Of_Books__c from Book__c ];
        return bookList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    
    //search book record by book name

    @AuraEnabled
    public static List<Book__c> searchBookName(String searchValue , String buttonLabelName){
        try {
            List<Book__c> bookList =new List<Book__c>();
            if(searchValue!=null && buttonLabelName =='Name'){
            String key =  searchValue + '%';
             bookList=[Select Name,ISBN_Number__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c where Name LIKE: key];
            }
            else  if(searchValue!=null && buttonLabelName =='ISBN'){
                String key =  searchValue + '%';
                 bookList=[Select Name,ISBN_Number__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c where ISBN_Number__c LIKE: key];
                }
            else  if(searchValue!=null && buttonLabelName =='Author'){
                String key =  searchValue + '%';
                 bookList=[Select Name,ISBN_Number__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c where Author__c LIKE: key];
                }
        return bookList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }





    //For LiabraryBookReader to get particular Book details

    @AuraEnabled
    public static Book__c getreturnSelectedBook(ID bookRecordId){
        try {
            Book__c fetchBook = new Book__c();
            if(bookRecordId != null){
             fetchBook=[Select Id,Name,ISBN_Number__c,Author__c,Price__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c where ID=:bookRecordId];
            }
            return fetchBook;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }




// update avalable book on Ui
    @AuraEnabled
    public static Book__c updateUI(ID bookRecordId){
        try {
            Book__c fetchBook = new Book__c();
            if(bookRecordId != null){
             fetchBook=[Select Id,Name,ISBN_Number__c,Author__c,Number_of_Free_Books__c,Number_Of_Issued_Book__c from Book__c where ID=:bookRecordId];
            }
            return fetchBook;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }












    //name of the Reader who issued book from which date to which date

    @AuraEnabled
    public static List<Issue__c> readerNameDate(ID bookRecordId){
        try {
            List<Issue__c> issuedBook= [Select Id,Book__c,Book_Copy__c,Reader_Name__r.Name, Book_Copy__r.Id, To_Date__c,From_Date__c from Issue__c where Book__c=:bookRecordId];
            return issuedBook;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }




    @AuraEnabled
    public static Issue__c returnDateUpdate( Date todate,ID copyRecordId, ID issueRecordId){
        try {
            List<Book_Copy__c> updateChecked =new List<Book_Copy__c>();
            //For To Date
            List<Issue__c> updateList =new List<Issue__c>();
            if(issueRecordId!=null){
            List<Issue__c> issuedBook= [Select Id, To_Date__c,From_Date__c from Issue__c where ID=:issueRecordId];
            for(Issue__c  issue:issuedBook){
                issue.To_Date__c=todate;
                updateList.add(issue);
            }
            update updateList;
           
            }

            //For unchecked Issue box in BooK Copies

           
            if(copyRecordId!=null){
            List<Book_Copy__c> checkedBook= [Select Id, Issued__c from Book_Copy__c where ID=:copyRecordId];
            for(Book_Copy__c  c:checkedBook){
                if(c.Issued__c==True){
               c.Issued__c=False;

                updateChecked.add(c);
                }
            }
            update updateChecked;
           
            
           
            }




            Issue__c newRecord=[Select Id,Book__c,Book_Copy__c,Reader_Name__r.Name, Book_Copy__r.Id, To_Date__c,From_Date__c from Issue__c where ID=:issueRecordId];
            
            return newRecord;
        

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    
       
    }
    
    
    
    