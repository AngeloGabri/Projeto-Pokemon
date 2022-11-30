//script do slide principal
var slide_hero = new Swiper(".slide-hero", {
  effect: 'fade',
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  }
});


const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
const btnCloseModal = document.querySelector('.js-close-modal-details');
const countPokemons = document.getElementById('js-count-pokemons');


cardPokemon.forEach(card => {
    card.addEventListener('click', openDetailsPokemon);
})

if(btnCloseModal){
  btnCloseModal.addEventListener('click', closeDetailsPokemon);
}


const btnDropdownSelect = document.querySelector('.js-open-select-custom');

btnDropdownSelect.addEventListener('click', () =>{
  btnDropdownSelect.parentElement.classList.toggle('active');
});


//script para regularização dos cards através dos dados 

const areaPokemons = document.getElementById('js-list-pokemons');


function primeiraLetraMaiscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
  //charAt = c  - UpperCase = C - Slice = C + harmender
}


function createCardPokemon(code, type, name, imagePok){
  let card = document.createElement('button');
  //criação do botão

  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute('code-pokemon', code);
  areaPokemons.appendChild(card);
  //aplicação das listas ja estilizadas no botão

  let image= document.createElement('div');
  image.classList ='image';
  card.appendChild(image);
  // criação de uma div com o nome de image e aplicação dela dentro do button

  let imageSrc = document.createElement('img');
  imageSrc.classList = 'thumb-img';
  imageSrc.setAttribute('src', imagePok);
  image.appendChild(imageSrc);
  // criação do elemento img e aplicação da classe thumb-img no elemento, atribuição do SRC da imagemPok e aplicação da img dentro da div image


  let infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info';
  card.appendChild(infoCardPokemon);
  //o restante segue a mesma linha de raciocinio acima :) 

  let infoTextPokemon = document.createElement('div');
  infoTextPokemon.classList = 'text';
  infoCardPokemon.appendChild(infoTextPokemon);

  let codePokemon = document.createElement('span');
  codePokemon.textContent = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;
  infoTextPokemon.appendChild(codePokemon);

  let namePokemon = document.createElement('h3');
  namePokemon.textContent = primeiraLetraMaiscula(name);
  infoTextPokemon.appendChild(namePokemon);

  let areaIcon = document.createElement('div');
  areaIcon.classList = 'icon';
  infoCardPokemon.appendChild(areaIcon);

  let imgType = document.createElement ('img');
  imgType.setAttribute('src', `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imgType);

}


//script para listagem de pokémons recebendo a URL da listagem quando a função é chamada

function listingPokemons(urlApi) {
  axios({
    method: 'GET',
    url: urlApi
  })
  .then((Response) => {

    const { results, next, count } = Response.data;
    countPokemons.innerText = count;

    results.forEach(pokemon =>{
      let urlApiDetails = pokemon.url;

      axios({
        method: 'GET',
        url: `${urlApiDetails}`
      })
      .then(Response =>{
        const { name, id, sprites, types} = Response.data;

        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name
        }

        createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);

        const cardPokemons = document.querySelectorAll('.js-open-details-pokemon');

        cardPokemons.forEach(card =>{
          card.addEventListener('click', openDetailsPokemon);
        })
      })

    })
  })
}

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

function openDetailsPokemon(){
  document.documentElement.classList.add('open-modal');

  let codePokemon = this.getAttribute('code-pokemon');
  let imagePokemon = this.querySelector('.thumb-img');
  let iconTypePokemon = this.querySelector('.info .icon img');
  let namePokemon = this.querySelector('.text h3');
  let codeStringPokemon = this.querySelector('.text span');


  const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
  const modalDetails = document.getElementById('js-modal-details');
  let iconTypePokemonModal = document.getElementById('js-image-type-modal');
  const namePokemonModal = document.getElementById('js-name-pokemon-modal');
  const codePokemonModal = document.getElementById('js-code-pokemon-modal');
  const  heightPokemonModal = document.getElementById('js-height-pokemon');
  const  weightPokemonModal = document.getElementById('js-weight-pokemon');
  const  mainAbilitiesPokemonModal = document.getElementById('js-abilities-pokemon');



  imgPokemonModal.setAttribute('src', imagePokemon.getAttribute('src'));
  modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
  iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));
 

  namePokemonModal.textContent = namePokemon.textContent;
  codePokemonModal.textContent = codeStringPokemon.textContent;
 
 
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`
  })
  .then(Response =>{
    let data = Response.data;
    let infoPokemon = {
      mainAbilities : primeiraLetraMaiscula(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url
    }


    function listingTypesPokemon(){
      const areaTypesModal = document.getElementById('js-types-pokemon')

      areaTypesModal.innerHTML = "";

      let arrayTypes = infoPokemon.types;

      arrayTypes.forEach(itemType =>{
        let itemList = document.createElement('li');
        areaTypesModal.appendChild(itemList);

        let spanList = document.createElement('span');
        spanList.classList = `tag-type ${itemType.type.name}`;
        spanList.textContent = primeiraLetraMaiscula(itemType.type.name);
        itemList.appendChild(spanList);
      })
    }

    function listingWeaknesses(){
      const areaWeak = document.getElementById('js-area-weak');

      areaWeak.innerHTML = '';

      axios({
        method: 'GET',
        url: `${infoPokemon.urlType}`
      })
      .then(Response =>{
        let weaknesses = Response.data.damage_relations.double_damage_from;

        weaknesses.forEach(itemType =>{
          let itemListWeak = document.createElement('li');
          areaWeak.appendChild(itemListWeak);
  
          let spanList = document.createElement('span');
          spanList.classList = `tag-type ${itemType.name}`;
          spanList.textContent = primeiraLetraMaiscula(itemType.name);
          itemListWeak.appendChild(spanList);
        })
      })
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    mainAbilitiesPokemonModal.textContent = infoPokemon.mainAbilities

    const statsHp = document.getElementById('js-stats-hp');
    const statsAttack = document.getElementById('js-stats-attack');
    const statsDefense = document.getElementById('js-stats-defese');
    const statsSpAttack = document.getElementById('js-stats-spAttack');
    const statsSpDefense = document.getElementById('js-stats-spDefense');
    const statsSpeed = document.getElementById('js-stats-speed');


    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

    listingTypesPokemon();
  listingWeaknesses();

  });
}





function closeDetailsPokemon(){
  document.documentElement.classList.remove('open-modal');
}


//Script para listagem dos TIPOS de pokémons

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');

axios({
  method: 'GET',
  url: 'https://pokeapi.co/api/v2/type'
})
.then(Response =>{
  const { results } = Response.data

  results.forEach((type, index) =>{

    if(index < 18){
      let itemType = document.createElement('li');
      areaTypes.appendChild(itemType);
  
  
      let buttonType = document.createElement('button');
      buttonType.classList = `type-filter ${type.name}`;
      buttonType.setAttribute('code-type', index + 1);
      itemType.appendChild(buttonType);
  
      let iconType = document.createElement('div');
      iconType.classList = "icon";
      buttonType.appendChild(iconType);
  
      let srcType = document.createElement('img');
      srcType.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconType.appendChild(srcType);

      let nameType = document.createElement('span');
      nameType.textContent = primeiraLetraMaiscula(type.name);
      buttonType.appendChild(nameType);

      //Aqui é o preenchimento do select mobile dos tipos

      let itemTypeMobile = document.createElement('li');
      areaTypesMobile.appendChild(itemTypeMobile);


      let buttonTypeSelect = document.createElement('button');
      buttonTypeSelect.classList = `type-filter ${type.name}`;
      buttonTypeSelect.setAttribute('code-type', index + 1);
      itemTypeMobile.appendChild(buttonTypeSelect);

      let iconTypeSelect = document.createElement('div');
      iconTypeSelect.classList = "icon";
      buttonTypeSelect.appendChild(iconTypeSelect);

      let srcTypeSelect = document.createElement('img');
      srcTypeSelect.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconTypeSelect.appendChild(srcTypeSelect);

      let nameTypeSelect = document.createElement('span');
      nameTypeSelect.textContent = primeiraLetraMaiscula(type.name);
      buttonTypeSelect.appendChild(nameTypeSelect);

      const allTypes = document.querySelectorAll('.type-filter')

      allTypes.forEach(btn => {
        btn.addEventListener('click', filterByTypes);
      })

    }
  })
})

//Aqui é o script que faz a funcionalidade do load more

const btnLoadMore = document.getElementById('js-btn-load-more');

let countPagination = 10;

function showMorePokemon(){
  listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`);

  countPagination = countPagination + 9;
}

btnLoadMore.addEventListener('click', showMorePokemon);

//função para filtrar os pokemons por tipo

function filterByTypes(){
  let idPokemon = this.getAttribute('code-type')

  const areaPokemons = document.getElementById('js-list-pokemons');
  const allTypes = document.querySelectorAll('.type-filter');
  const countPokemonsType = document.getElementById('js-count-pokemons')
  const btnLoadMore = document.getElementById('js-btn-load-more');
  
  //Limpando tela para listagem
  areaPokemons.innerHTML = "";
  btnLoadMore.style.display = "none";
 
  const sectionPokemons = document.querySelector('.s-all-info-pokemons');
  const TopSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: TopSection + 288,
    behavior: 'smooth'
  })

  allTypes.forEach(type =>{
    type.classList.remove('active');
  });
  this.classList.add('active');

  if(idPokemon){
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${idPokemon}`
    })
    .then(Response =>{
      const { pokemon } = Response.data
  
      countPokemonsType.textContent = pokemon.length;
  
      pokemon.forEach(pok =>{
        const { url } = pok.pokemon;
  
        axios({
          method: 'GET',
          url: `${url}`
        })
        .then(Response =>{
          
          const { name, id, sprites, types} = Response.data;
  
          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name
          }
  
          if(infoCard.image){
            createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
          }
          
  
          const cardPokemons = document.querySelectorAll('.js-open-details-pokemon');
  
          cardPokemons.forEach(card =>{
            card.addEventListener('click', openDetailsPokemon);
        })
      })
    })
  })
  } else{
    areaPokemons.innerHTML = "";

    listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

    btnLoadMore.style.display = "block";
  }
}

//Script para buscar pokemon pelo INPUT

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');
const removeDisabled = document.getElementById('icon');

btnSearch.addEventListener('click', searchPokemon);


inputSearch.addEventListener('keyup', (event) =>{
  if(event.code == 'Enter'){
    searchPokemon();
  }
  
  disabledBtn();
  
});

function disabledBtn(){
  if(inputSearch != ""){
    removeDisabled.removeAttribute("disabled");
  } else{
    removeDisabled.setAttribute("disabled");
  }
}

function searchPokemon(){
  let valueInput  = inputSearch.value.toLowerCase();
  const typeFilter = document.querySelectorAll('.type-filter');

  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
  })
  .then(Response =>{
    
    areaPokemons.innerHTML = '';
    btnLoadMore.style.display = 'none';
    countPokemons.textContent = 1;


    const { name, id, sprites, types} = Response.data;
  
    const infoCard = {
      nome: name,
      code: id,
      image: sprites.other.dream_world.front_default,
      type: types[0].type.name
    }

    if(infoCard.image){
      createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
    }
    

    const cardPokemons = document.querySelectorAll('.js-open-details-pokemon');

    cardPokemons.forEach(card =>{
      card.addEventListener('click', openDetailsPokemon);
    })
  })
  .catch((error) => {
    if(error){
      areaPokemons.innerHTML = '';
      btnLoadMore.style.display = 'none';
      countPokemons.textContent = 0;
      alert('Não foi encontrado nenhum resultado com esta pesquisa!');
    }
  })
};
