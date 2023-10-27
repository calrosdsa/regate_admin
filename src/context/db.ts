let db:IDBDatabase | null = null
export const isDb = () =>{
    return db != null
}
export const initDb = () => {
    try {
      const dbName = "regate";
      const request:IDBOpenDBRequest = indexedDB.open(dbName, 1);
      request.onerror = (event) => {
        // Handle errors.
      };
      request.onsuccess = (event:any) =>{
        console.log("DB INIT SUCCESS")
        db = event.target.result;
      }
      request.onupgradeneeded = (event:any) => {
        console.log("DB NEED UPGRADE")
        db = event.target.result
        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        const objectStore = db?.createObjectStore("messages", { keyPath: "id" });
        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore?.createIndex("profile_id", "profile_id");
      
        // Create an index to search customers by email. We want to ensure that
        // no two customers have the same email, so use a unique index.
        objectStore?.createIndex("chat_id", "chat_id");
        // objectStore?.createIndex("content", "content");
        // objectStore?.createIndex("created_at", "created_at");
        // objectStore?.createIndex("type_message", "type_message");
        // objectStore?.createIndex("reply_to", "reply_to");
        // objectStore?.createIndex("parent_id", "parent_id");
      };
      
  
        } catch (e) {
            console.log('error', e);
        }
        
  }
  export const getMessagesChat = (chatId:number):ConversationMessage[]  => {
    const messages:ConversationMessage[] = [];
    if(db != null){
        const singleKeyRange = IDBKeyRange.only(chatId);
        db.transaction("messages").objectStore("messages")
        .index("chat_id")
        .openCursor(singleKeyRange).onsuccess = (event:any) => {
            const cursor = event.target.result;
            if (cursor) {
              messages.push(cursor.value);
              cursor.continue();
            } else {
              console.log(`Message lenght ${messages.length}`);
            }
          }; 
        }

    return messages   
}

  export const insertMessage = (message:ConversationMessage) => {
    try{

      if(db != null){
        const transaction = db.transaction(["messages"],"readwrite")
        transaction.oncomplete = (event) => {
          console.log("All done!");
        };
        
        transaction.onerror = (event) => {
          // Don't forget to handle errors!
        };
        
        const objectStore = transaction.objectStore("messages");
        
          const request = objectStore.add(message);
          request.onsuccess = (event) => {
            // event.target.result === customer.ssn;
          };
      }else{
        console.log("DB IS NULL")
      }
    }catch(err){
      console.log(err)
    }
  }
