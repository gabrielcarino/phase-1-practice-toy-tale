let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(respObj => makeCard(respObj))

  function makeCard(toys) {
    const toyCollection = document.getElementById('toy-collection');
    toys.forEach(obj => {
      const card = document.createElement('div');
      const toyName = document.createElement('h2');
      const image = document.createElement('img');
      const likes = document.createElement('p');
      const likeButton = document.createElement('button');
      card.className = 'card';
      toyName.innerText = obj['name'];
      image.src = obj['image'];
      image.className = 'toy-avatar';
      likes.innerText = `${obj['likes']} likes`;
      likeButton.className = 'like-btn';
      likeButton.id = obj['id'];
      likeButton.innerText = 'Like';
      card.append(toyName);
      card.append(image);
      card.append(likes);
      card.append(likeButton);
      toyCollection.append(card);
      likeButton.addEventListener('click', () => likeToy(obj))
    })
  }

  const newToyForm = document.querySelector('.add-toy-form');
  function submitNewToy(toy) {
    const newToy = {
      name: `${toy.name.value}`,
      image: `${toy.image.value}`,
      likes: 0
    };
    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy),
    };
    fetch('http://localhost:3000/toys', configObj)
      .then(resp => resp.json())
      .then(toy => {
        const card = document.createElement('div')
        card.className = 'card';
        card.innerHTML = `<h2>${toy.name}</h2>
        <img src=${toy.image} class='toy-avatar'>
        <p>${toy.likes} likes</p>
        <button class='like-btn' id=${toy.id}>Like</button>`;
        document.getElementById('toy-collection').append(card);
    })
  }
  newToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitNewToy(e.target);
    e.target.reset();
  })

  function likeToy(toy) {
    const newNumberOfLikes = toy.likes += 1
    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": newNumberOfLikes
      })
    };
    fetch(`http://localhost:3000/toys/${toy.id}`, configObj)
      .then(resp => resp.json())
      .then(newLikes => {
        let currId = document.getElementById(`${toy.id}`)
        let currToy = currId.parentElement
        let currLikes = currToy.querySelector('p');
        console.log(currLikes);
        currLikes.innerText = `${newLikes['likes']} likes`;
      })
  };
})

