// api 




//modal button
const closeModalButton = document.getElementById('close-modal'); // select the close button element of the modal
const modal = document.getElementById('modal'); // Selects the modal element itself.
const modalContent = $('.modal-content'); // Selects the modal content using jQuery.
const addChampButton = $('.add-champ')   // Selects the add champion button using jQuery.
const openModalButtons = document.querySelectorAll('#open-modal'); // Selects all elements with the id 'open-modal', which likely are buttons that open the modal.
//const champions = []
let buttonClicked = null  // Initializes a variable to hold the clicked button.


openModalButtons.forEach(button => {
    // Adds event listeners to each button that opens the modal.
    button.addEventListener('click', () => {
        modal.classList.remove('hidden'); // Removes the 'hidden' class from the modal, making it visible.
    })
    button.addEventListener('click', storeClick)  // Adds another event listener to store the clicked button.
});

function storeClick(e){
     //This function stores the button that was clicked.
    buttonClicked = e.target // Stores the clicked button in the 'buttonClicked' variable.
    console.log(buttonClicked)  // Logs the clicked button to the console.
}

closeModalButton.addEventListener('click', () => {
    // Adds an event listener to the close button of the modal.
    modal.classList.add('hidden'); // Adds the 'hidden' class to the modal, hiding it.
});

//Takes in API call and creates divs for each champ
function processChampionList (championData) {
    for(let champion in championData) {
        const name = championData[champion].name
        const title = championData[champion].title
        const tags = championData[champion].tags[0]
        const picture = championData[champion].image.full
       

        // const objectChampion = {
        //     champName: name,
        //     champTitles: title,
        //     championTags: tags
        // }

        // champions.push(objectChampion)

        modalContent.append(`<div data-title="${title}" data-tags="${tags}" data-picture="${picture}" class="champion-name p-1">${name}</div>`)
    }
    
    //Add event listener to all chammp names
    $('.champion-name').on('click', addChamp)
}

function addChamp(e){
    modal.classList.add('hidden')   // Hides the modal when a champion is selected.
    const champName = e.target.innerText  // Retrieves the name of the champion from the clicked element.
    const champTitle = e.target.getAttribute('data-title') // Retrieves the title of the champion from the clicked element's data attribute.
    const champTags = e.target.getAttribute('data-tags') // Retrieves the role/tag of the champion from the clicked element's data attribute.
    const picture = e.target.getAttribute('data-picture')  // Retrieves the picture of the champion from the clicked element's data attribute.
    const parent = buttonClicked.parentElement // Finds the parent element of the clicked button.
    const grandparent = parent.parentElement   // Finds the parent's parent element (grandparent) which likely holds the champion details.
    const nameElement = $(grandparent).find('.name') // Finds the element with the class 'name' within the grandparent element.
    const titleElement = $(grandparent).find('.title')  // Finds the element with the class 'title' within the grandparent element.
    const roleElement = $(grandparent).find('.role')   // Finds the element with the class 'role' within the grandparent element.
    nameElement.text(`Name: ${champName}, ${champTitle}`)  // Updates the text content of the name element to include the champion's name and title.
    roleElement.text(`Role: ${champTags}`) // Updates the text content of the role element to include the champion's role/tag.
    const myImage = new Image(100, 100)    // Creates a new image element with width and height of 100px and sets its source.
    myImage.src = `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${picture}`
    
    const champIconDiv = $(grandparent).find('.champ-icon') // Finds the element with the class 'champ-icon' within the grandparent element and empties it.
    champIconDiv.empty()
    champIconDiv.append(`<img class="img" src="${myImage.src}"></img>`)  // Appends the image element (champion icon) to the champIconDiv.
    
    $('.img').on('click', () => {
        modal.classList.remove('hidden'); // Removes the 'hidden' class from the modal, making it visible.
    })
    $('.img').on('click', storeClick) 
}


function getChampionData() {
    const url = 'https://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/champion.json';

    fetch(url)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            const championList = data.data
            console.log(data.data)
            processChampionList(championList)
        })
}


// console.log(champList)

getChampionData()


