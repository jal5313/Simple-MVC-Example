const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

let lastAdded = new Cat(defaultData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    return res.json(doc);
  };
  Cat.findByName(name1, callback);
};
const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); 
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;
    res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned });
  });

  savePromise.catch((err) => res.json({ err }));

  return res;
};
const searchName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); 
    }
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;
  const savePromise = lastAdded.save();
  savePromise.then(() => res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned }));

  savePromise.catch((err) => res.json({ err }));
};
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};


const createDog = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name,breed and age are all required' });
  }

  const name = `${req.body.name}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    res.json({ name: newDog.name, breed: newDog.breed, age: newDog.age });
  });

  savePromise.catch((err) => res.json({ err }));

  return res;
};


const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); 
    }
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }
      
    doc.age = doc.age + 1;

    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  readCat,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
  createDog: createDog,
  searchDogName: searchDogName,
};
