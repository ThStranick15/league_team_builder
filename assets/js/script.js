// api 

let storedChampArray = JSON.parse(localStorage.getItem('champs')) || new Array(10)

//let champArray = 


//modal button
const closeModalButton = document.getElementById('close-modal'); // select the close button element of the modal
const modal = document.getElementById('modal'); // Selects the modal element itself.
const modalContent = $('.modal-content'); // Selects the modal content using jQuery.
const addChampButton = $('.add-champ')   // Selects the add champion button using jQuery.
const openModalButtons = document.querySelectorAll('#open-modal'); // Selects all elements with the id 'open-modal', which likely are buttons that open the modal.
//const champions = []
let buttonClicked = null  // Initializes a variable to hold the clicked button.


openModalButtons.forEach(button => {
    // Adds event listeners to each button that opens the modal.s
    button.addEventListener('click', () => {
        modal.classList.remove('hidden'); // Removes the 'hidden' class from the modal, making it visible.
        console.log(button)
    })
    button.addEventListener('click', storeClick)  // Adds another event listener to store the clicked button.
});

function storeClick(e) {
    //This function stores the button that was clicked.
    buttonClicked = e.target // Stores the clicked button in the 'buttonClicked' variable.
}

closeModalButton.addEventListener('click', () => {
    // Adds an event listener to the close button of the modal.
    modal.classList.add('hidden'); // Adds the 'hidden' class to the modal, hiding it.
});

//Takes in API call and creates divs for each champ
function processChampionList(championData) {
    for (let champion in championData) {
        const name = championData[champion].name
        const title = championData[champion].title
        const tags = championData[champion].tags
        const picture = championData[champion].image.full
        const key = championData[champion].key

        modalContent.append(`<div data-name="${name}" data-title="${title}" data-tags="${tags}" data-picture="${picture}" data-key="${key}" class="champion-name p-1"><img src="https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${picture}" width="100" height="100">${name}</div>`)
    }

    modalContent.on('click', function (e) {
        if (e.target.parentElement.classList.contains("champion-name")) {
            addChamp(e.target.parentElement);
        }
    });
}

function addChamp(e) {
    modal.classList.add('hidden')   // Hides the modal when a champion is selected.
    const champName = e.getAttribute('data-name')  // Retrieves the name of the champion from the clicked element.
    const champTitle = e.getAttribute('data-title') // Retrieves the title of the champion from the clicked element's data attribute.
    const champTags = e.getAttribute('data-tags') // Retrieves the role/tag of the champion from the clicked element's data attribute.
    const picture = e.getAttribute('data-picture')  // Retrieves the picture of the champion from the clicked element's data attribute.
    const champKey = e.getAttribute('data-key')
    const tagsArray = champTags.split(',') // Split the tags into an array and join them with spaces.
    const formattedTags = tagsArray.join(', ') // Add a space after each tag.
    const parent = buttonClicked.parentElement // Finds the parent element of the clicked button.
    const grandparent = parent.parentElement   // Finds the parent's parent element (grandparent) which likely holds the champion details.
    const nameElement = $(grandparent).find('.name') // Finds the element with the class 'name' within the grandparent element.
    const roleElement = $(grandparent).find('.role')   // Finds the element with the class 'role' within the grandparent element.
    nameElement.text(`${champName}, ${champTitle}`)  // Updates the text content of the name element to include the champion's name and title.
    roleElement.text(`Role: ${formattedTags}`) // Updates the text content of the role element to include the champion's role/tag.
    const myImage = new Image(100, 100)    // Creates a new image element with width and height of 100px and sets its source.
    myImage.src = `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${picture}`
    const myImageSrc = myImage.src

    const champIconDiv = $(grandparent).find('.champ-icon') // Finds the element with the class 'champ-icon' within the grandparent element and empties it.
    champIconDiv.empty()
    champIconDiv.append(`<img class="img" src="${myImageSrc}"></img>`)  // Appends the image element (champion icon) to the champIconDiv.

    $('.img').on('click', () => {
        modal.classList.remove('hidden'); // Removes the 'hidden' class from the modal, making it visible.
    })
    $('.img').on('click', storeClick)

    //Adds Damage Type to Champ Cards
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${champKey}.json`;



    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            let damage = data.tacticalInfo.damageType;
            damage = damage.replace('k', '')
            const typeElement = $(grandparent).find('.damage-type')
            typeElement.text(`Damage Type: ${damage}`)
            return damage
        })
        .then(function (damage){
            
            const objectChampion = {
                champName: champName,
                champTitles: champTitle,
                championTags: formattedTags,
                champPictureSrc: myImageSrc,
                champDamageType: damage
            }
        
            const champIndex = grandparent.getAttribute('data-index') //Add data-index on each champ card to assign it to array value
        
            storedChampArray.splice(champIndex, 1, objectChampion)
        
            localStorage.setItem('champs', JSON.stringify(storedChampArray))
        
            console.log(storedChampArray)
        })

   
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

function initChamps() {
    for(let i = 0; i < 10; i++){
        const article = document.querySelector(`[data-index="${i}"]`)
        const champ = storedChampArray[i]
        if(champ){
            $(article).find('.name').text(`${champ.champName}, ${champ.champTitles}`)
            $(article).find('.role').text(`Role: ${champ.championTags}`)
            $(article).find('.damage-type').text(`Damage Type: ${champ.champDamageType}`)

            const champIconDiv = $(article).find('.champ-icon') // Finds the element with the class 'champ-icon' within the grandparent element and empties it.
            champIconDiv.empty()
            champIconDiv.append(`<img class="img" src="${champ.champPictureSrc}"></img>`) 

            $('.img').on('click', () => {
                modal.classList.remove('hidden'); // Removes the 'hidden' class from the modal, making it visible.
            })
            $('.img').on('click', storeClick)
        }
    }

}



// console.log(champList)

getChampionData()
initChamps()


