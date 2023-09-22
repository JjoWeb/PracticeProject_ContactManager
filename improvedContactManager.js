//Create array to store contacts 
let contactArray = [];
let eachContact;

//Create class and an instance to recieve contact info
class Contact {
    constructor(givenName, familyName, phoneNumber, email) {
        this.givenName = givenName;
        this.familyName = familyName;
        this.phoneNumber = phoneNumber;
        this.email = email;
    };
};

let newContact = new Contact();

//Start working with the DOM
window.addEventListener('load', function elemsAssemble() {

    //Define global variables
    const mainContainer = document.querySelector('#mainContainer');
    const homePage = document.querySelector('#homePage');
    const loadContactsHome = document.querySelector('#loadContactsHome');
    const addContactHome = document.querySelector('#addContactHome');
    const manager = document.querySelector('#manager');
    const inputs = document.querySelectorAll('.inputs');
    const addContactButton = document.querySelector('#addContactButton');
    const contactListButton = document.querySelector('#contactListButton');
    const contactListSection = document.querySelector('#contactListSection');
    const loadButtonList = document.querySelector('#loadButtonList');
    const contactsAmountSpan = document.querySelector('#contactsAmountSpan');
    const addContactButtonList = document.querySelector('#addContactButtonList');
    const sortAZButton = document.querySelector('#sortAZButton');
    const sortTelButton = document.querySelector('#sortTelButton');
    const sortEmailButton = document.querySelector('#sortEmailButton');
    const searchInput = document.querySelector('#searchInput');
    searchInput.value = "";
    let contactAmount = 0;

    //Show homepage
    mainContainer.append(homePage);

    function showContactList() {
        homePage.style.display = 'none';
        manager.style.display = 'none';
        
        if (localStorage.contacts !== undefined) {
            contactListSection.style.display = 'block';
            mainContainer.append(contactListSection);
        } else {
            contactListSection.style.display = 'block';
            mainContainer.append(contactListSection);
            newContactConfirm.innerHTML = "STORAGE IS EMPTY";
            newContactConfirm.style.opacity = '1';
            newContactConfirm.style.transition = 'opacity .5s';
        }

    }

    loadContactsHome.addEventListener('click', () => {
            showContactList();
            loadFromStorage();
    })


    loadButtonList.onclick = loadFromStorage;

    contactListButton.addEventListener('click', showContactList);


    function showAddContactPage() {
        homePage.style.display = 'none';
        contactListSection.style.display = 'none';
        manager.style.display = 'block';
        mainContainer.append(manager);
    }


    addContactButtonList.addEventListener('click', () => {
        newContactConfirm.style.opacity = '0';
        newContactConfirm.style.transition = 'opacity .5s';
        
        showAddContactPage();

    });

    addContactHome.addEventListener('click', showAddContactPage);

    //Asign input values to "newContact" instance
    document.querySelector('#nameInput').oninput = function getName() {
        newContact.givenName = nameInput.value;
    };
    document.querySelector('#familyNameInput').oninput = function getFamilyName() {
        newContact.familyName = familyNameInput.value;
    };
    document.querySelector('#phoneNumberInput').oninput = function getPhoneNumber() {
        newContact.phoneNumber = phoneNumberInput.value;
    };
    document.querySelector('#emailInput').oninput = function getEmail() {
        newContact.email = emailInput.value;
    };


    //Validate and add contact info to array, and confirm user
    addContactButton.onclick = function addContactData() {   
        //Validate inputs
        if((nameInput.value == "") || ((phoneNumberInput.value == "") && (emailInput.value == ""))) {
            alert ("A name and a phone number or email is required");
            return false;
        };

        //Push to "contactArray"
        contactArray.push(
            {name: (nameInput.value), 
            familyName: (familyNameInput.value),
            phoneNumber: (phoneNumberInput.value),
            email: (emailInput.value)
            },
        );

        saveToStorage();

        //Update contact count
        contactAmount++;
        document.querySelector('#contactsAmountSpan').innerHTML = "<br> (" + contactAmount + " contacts)";

        //Confirm contact addition
        newContactConfirm.innerHTML = "CONTACT SAVED";
        newContactConfirm.style.opacity = '1';
        newContactConfirm.style.transition = 'opacity .5s';
        
        //Make list of contacts, remove button and edit button
        let contactToList = document.createElement ('li');
        contactToList.innerHTML = "Name: " + nameInput.value + " " + familyNameInput.value + "<br>" + 
                                    "Phone number: " + phoneNumberInput.value + "<br>" + 
                                    "email: " + emailInput.value;                      
        let removeButton = document.createElement('button');
        //removeButton.src = "http://i.imgur.com/yHyDPio.png";
        removeButton.innerHTML = "Remove";
        removeButton.addEventListener('click', removeContact);
        let editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.addEventListener('click', editContact);
        for (let index = 0; index <= contactArray.length; index++) {
            removeButton.id = index;
            contactToList.id = "li" + index;
            editButton.id = "eB" + index;
            removeButton.setAttribute('class', index);  
            contactToList.setAttribute('class', index);
            editButton.setAttribute('class', index);
        }

        //Append contact list to HTML section
        document.querySelector('#contactList').append(contactToList);
        document.querySelector('#contactList').append(removeButton);
        document.querySelector('#contactList').append(editButton);

        loadButtonList.setAttribute('disabled', '');

        showContactList();
            
        //Empty input values
        nameInput.value = "";
        familyNameInput.value = "";
        phoneNumberInput.value = "";
        emailInput.value = "";
    }    
    

    //Search function
    searchInput.oninput = function search() {
        //Disable sort button while user searches
        searchInput.onfocus =
            sortAZButton.setAttribute('disabled', '');
            sortTelButton.setAttribute('disabled', '');
            sortEmailButton.setAttribute('disabled', '');

        //Detect empty input value and deleted contacts
        let idIndex1 = 1;

        contactArray.forEach((e) => {

        if (searchInput.value === "") {
            sortAZButton.removeAttribute('disabled', '');
            sortTelButton.removeAttribute('disabled', '');
            sortEmailButton.removeAttribute('disabled', '');

            
            document.querySelector("#li" + idIndex1).style.display = 'block';
            document.getElementById(idIndex1).style.display = 'inline-block';
            document.querySelector("#eB" + idIndex1).style.display = 'inline-block';
        }

        if (e.name === "") {
            document.querySelector("#li" + idIndex1).style.display = 'none';
            document.getElementById(idIndex1).style.display = 'none';
            document.querySelector("#eB" + idIndex1).style.display = 'none';
        }

        idIndex1++;
        });

        //Convert search and names to susbtrings and compare letter-by-letter         
        for (let allLetters = 0; allLetters < searchInput.value.length; allLetters++) {
            let letter = searchInput.value[allLetters];
            let idIndex2 = 1;

            for (let allNames = 0; allNames < contactArray.length; allNames++) {
                let eachContact = contactArray[allNames];
                
                if (searchInput.value.toLowerCase().substring(0, allLetters + 1) === contactArray[allNames].name.toLowerCase().substring(0, allLetters + 1)) {
                    document.querySelector("#li" + idIndex2).style.display = 'block';
                    document.getElementById(idIndex2).style.display = 'inline-block';
                    document.getElementById("eB" + idIndex2).style.display = 'inline-block';
                } else if 
                    (searchInput.value.toLowerCase().substring(0, allLetters + 1) !== contactArray[allNames].name.toLowerCase().substring(0, allLetters + 1)) {
                        document.querySelector("#li" + idIndex2).style.display = 'none';
                        document.getElementById(idIndex2).style.display = 'none';
                        document.getElementById("eB" + idIndex2).style.display = 'none';
                }  

                idIndex2++;
            }
        }
   }


    //Remove contact function
    function removeContact(e) {
        let startIndex = e.target.id - 1;
        contactArray.splice(startIndex, 1, {name:"", familyName:"", phoneNumber:"", email:""});
        document.querySelector('#li' + e.target.id).style.display = 'none';
        document.getElementById(e.target.id).style.display = 'none';
        document.querySelector('#eB' + e.target.id).style.display = 'none';

        console.log("Contact removed");

        contactAmount--;
        if(contactAmount <= 0){
            contactsAmountSpan.innerHTML = ("<br> (No contacts have been added)");
        } else {
        contactsAmountSpan.innerHTML = ("<br> (" + contactAmount + " contacts)");
        };

        newContactConfirm.innerHTML = "CONTACT REMOVED";
        newContactConfirm.style.opacity = '1';
        newContactConfirm.style.transition = 'opacity .5s';
    
        saveToStorage();
    }   


    function editContact(e) {
        //Disable possibly-conflicting elems; show user inputs and confirm button 
        let liIndex = 1;

        do {
            document.querySelector("#addContactButton").setAttribute('disabled', '');
            document.querySelector("#eB" + liIndex).setAttribute('disabled', '');
            document.getElementById(liIndex).setAttribute('disabled', '');
            document.querySelector('#sortAZButton').setAttribute('disabled', '');
            document.querySelector('#sortTelButton').setAttribute('disabled', '');
            document.querySelector('#sortEmailButton').setAttribute('disabled', '');
            document.querySelector('#searchInput').setAttribute('disabled', '');
            document.querySelector('#loadButtonList').setAttribute('disabled', '');
            document.querySelector('#addContactButtonList').setAttribute('disabled', '');

            liIndex++;

        } while (liIndex <= contactArray.length);

        let editIndex = e.target.className;
        let startIndex = editIndex - 1;
        let eachLi = document.querySelector('#li' + editIndex);

        eachLi.innerHTML = 
            "<input id= 'nameEditInput' placeholder= 'Name' value = " + contactArray[startIndex].name + "></input>" +
            "<input id= 'fNameEditInput' placeholder= 'Family Name' value = " + contactArray[startIndex].familyName + "></input>" +
            "<input id= 'telEditInput' placeholder= 'Phone number' value = " + contactArray[startIndex].phoneNumber + "></input>" +
            "<input id= 'emailEditInput' placeholder= 'Email' value = " + contactArray[startIndex].email + "></input>";
        
        let confirmEditButton = document.createElement('button');  
        confirmEditButton.innerHTML = "OK";   
        confirmEditButton.id = "cEButton";  
        
        eachLi.append(confirmEditButton);

        //Update contactArray and HTML list; remove 'disable' from possibly-conflictig elems
        confirmEditButton.onclick = function confirmEdit() {
            contactArray.splice(startIndex, 1, {
                name: document.querySelector('#nameEditInput').value, 
                familyName: document.querySelector('#fNameEditInput').value, 
                phoneNumber: document.querySelector('#telEditInput').value, 
                email: document.querySelector('#emailEditInput').value
            });

            saveToStorage();

            document.querySelector('#li' + editIndex).innerHTML = 
                "Name: " + nameEditInput.value + " " + fNameEditInput.value + "<br>" + 
                "Phone number: " + telEditInput.value + "<br>" + 
                "email: " + emailEditInput.value;

                newContactConfirm.innerHTML = "CONTACT SAVED";

            liIndex = 1;

            do {
                document.querySelector("#addContactButton").removeAttribute('disabled', '');
                document.querySelector("#eB" + liIndex).removeAttribute('disabled', '');
                document.getElementById(liIndex).removeAttribute('disabled', '');
                document.querySelector('#sortAZButton').removeAttribute('disabled', '');
                document.querySelector('#sortTelButton').removeAttribute('disabled', '');
                document.querySelector('#sortEmailButton').removeAttribute('disabled', '');
                document.querySelector('#searchInput').removeAttribute('disabled', '');
                document.querySelector('#addContactButtonList').removeAttribute('disabled', '');

                liIndex++;
                
            }  while (document.querySelector("#eB" + liIndex).disabled = true);
        }
    }

   
    //Contact sort functions
    sortAZButton.onclick = function sortAZ() {
        //Sort "contactArray" by name
        contactArray.sort((a, b) => {    
            let na = a.name.toLowerCase(),
                nb = b.name.toLowerCase();

            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        }) 

        sortLi();
        saveToStorage();
    }

    sortTelButton.onclick = function sortTel() {
    //Sort "contactArray" by telephone number
        contactArray.sort((a, b) => {    
            let na = a.phoneNumber,
                nb = b.phoneNumber;

            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        }) 

        sortLi();
        saveToStorage();
    };  

    sortEmailButton.onclick = function sortTel() {
        //Sort "contactArray" by email
        contactArray.sort((a, b) => {    
            let na = a.email.toLowerCase(),
                nb = b.email.toLowerCase();

            if (na < nb) {
                return -1;
            }
            if (na > nb) {
                return 1;
            }
            return 0;
        }) 

        sortLi();
        saveToStorage();
    }
    
    //Change every innerHTML in "<li>" to new order
    function sortLi() {
        for (let allContacts = 0, allLiId = 1; allContacts < contactArray.length; allContacts++, allLiId++) {  
            let eachContact = contactArray[allContacts];
            let contactToList = document.querySelector("#li" + allLiId);
            let removeButton = document.getElementById(allLiId);
            let editButton = document.getElementById("eB" + allLiId);

            if (eachContact.name !== "") {
                contactToList.innerHTML = "Name: " + eachContact.name + " " + eachContact.familyName + "<br>" + 
                                            "Phone number: " + eachContact.phoneNumber + "<br>" + 
                                            "email: " + eachContact.email;
                contactToList.style.display = 'block';
                removeButton.style.display = 'inline-block';
                document.getElementById("eB" + allLiId).style.display = 'inline-block';
            } 
            else {
                contactToList.style.display = 'none';
                removeButton.style.display = 'none';
                editButton.style.display = 'none';
            } 
        }
    }

    
    //Animate "add contact" button and confirmation
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].oninput = function animateButtonAndConfirmation() {   
            addContactButton.style.opacity = '1';
            addContactButton.style.transition = 'opacity .5s';
            newContactConfirm.style.opacity = '0';
            newContactConfirm.style.transition = 'opacity .5s';
            };
    };


    function saveToStorage() {
        localStorage.contacts = JSON.stringify(contactArray);
    }


    function loadFromStorage() {
        contactArray = JSON.parse(localStorage.contacts);

        loadButtonList.setAttribute('disabled', '');

        //Confirm load
        newContactConfirm.innerHTML = "LOAD COMPLETE";
        newContactConfirm.style.opacity = '1';
        newContactConfirm.style.transition = 'opacity .5s';
 
        for (let allContacts = 0, allLiId = 1; allContacts < contactArray.length; allContacts++, allLiId++) {  
            let eachContact = contactArray[allContacts];

            let newLi = document.createElement('li');
            newLi.id = ("li" + allLiId);
            newLi.setAttribute('class', allLiId);
            let newRb = document.createElement('button');
            newRb.innerHTML = "Remove";
            newRb.id = allLiId;
            newRb.setAttribute('class', allLiId);  
            newRb.addEventListener('click', removeContact);
            let newEb = document.createElement('button');
            newEb.innerHTML = "Edit";
            newEb.id = ("eB" + allLiId);
            newEb.setAttribute('class', allLiId);
            newEb.addEventListener('click', editContact);

            console.log(JSON.parse(localStorage.contacts));
            console.log(newLi.id);
            console.log(eachContact.name);

            if (eachContact.name !== "") {
                newLi.innerHTML =
                    "Name: " + eachContact.name + " " + eachContact.familyName + "<br>" + 
                    "Phone number: " + eachContact.phoneNumber + "<br>" + 
                    "email: " + eachContact.email;
                newLi.style.display = 'block';
                newRb.style.display = 'inline-block';
                newEb.style.display = 'inline-block';
                contactAmount++;
                contactsAmountSpan.innerHTML = "<br> (" + contactAmount + " contacts)";
            } 
            else {
                newLi.style.display = 'none';
                newRb.style.display = 'none';
                newEb.style.display = 'none';
            } 

            //Append contacts and buttons to contactList section
            document.querySelector('#contactList').append(newLi);
            document.querySelector('#contactList').append(newRb);
            document.querySelector('#contactList').append(newEb);
        }

        console.log("Saved contacts loaded");
    }
});