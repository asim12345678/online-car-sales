document.addEventListener('DOMContentLoaded', function() {
    
    let loggedInUsername = '';

    
    const registrationForm = document.getElementById('registration-form');
    const formMessage = document.getElementById('form-message');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

          
            formMessage.textContent = '';

           
            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

           
            if (!name || !address || !phone || !email || !username || !password) {
                formMessage.textContent = 'All fields marked with * are required.';
                formMessage.style.color = 'red';
                return;
            }

            
            if (!validateForm(username, password, email)) {
                return; 
            }

          
            if (localStorage.getItem(username)) {
                formMessage.textContent = 'Username already exists. Please choose a different username.';
                formMessage.style.color = 'red';
                return;
            }

           
            const sellerData = { name, address, phone, email, username, password };

            
            localStorage.setItem(username, JSON.stringify(sellerData));

            
            formMessage.textContent = 'Registration successful!';
            formMessage.style.color = 'green';

            
            registrationForm.reset();
        });
    }

    
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

           
            const sellerData = JSON.parse(localStorage.getItem(username));

            if (sellerData && sellerData.password === password) {
                loggedInUsername = username; 
                loginMessage.textContent = 'Login successful!';
                loginMessage.style.color = 'green';

               
                document.querySelector('.add-car').style.display = 'block';

                
                sessionStorage.setItem('loggedInUser', username);
            } else {
                loginMessage.textContent = 'Invalid username or password.';
                loginMessage.style.color = 'red';
            }

            
            loginForm.reset();
        });
    }

    const addCarForm = document.getElementById('add-car-form');

    if (addCarForm) {
        addCarForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            if (!loggedInUsername) {
                alert("Please log in before adding a car.");
                return;
            }

            
            const carData = {
                make: document.getElementById('make').value.trim(),
                model: document.getElementById('model').value.trim(),
                year: document.getElementById('year').value.trim(),
                mileage: document.getElementById('mileage').value.trim(),
                location: document.getElementById('location').value.trim(),
                price: document.getElementById('price').value.trim()
            };

            
            let sellerData = JSON.parse(localStorage.getItem(loggedInUsername));

            
            if (!sellerData.cars) {
                sellerData.cars = [];
            }
            sellerData.cars.push(carData);
            localStorage.setItem(loggedInUsername, JSON.stringify(sellerData));

           
            alert("Car added successfully!");

            
            addCarForm.reset();
        });
    }

    
    const searchForm = document.getElementById('search-form');
    const searchResultsDiv = document.getElementById('search-results');

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const model = document.getElementById('model').value.trim().toLowerCase();
            const location = document.getElementById('location').value.trim().toLowerCase();

            
            const allCars = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const sellerData = JSON.parse(localStorage.getItem(key));
                if (sellerData && sellerData.cars) {
                    allCars.push(...sellerData.cars);
                }
            }

            
            const filteredCars = allCars.filter(car => 
                car.model.toLowerCase().includes(model) &&
                car.location.toLowerCase().includes(location)
            );

            searchResultsDiv.innerHTML = ''; 
            if (filteredCars.length > 0) {
                filteredCars.forEach(car => {
                    const carDiv = document.createElement('div');
                    carDiv.textContent = `Make: ${car.make}, Model: ${car.model}, Location: ${car.location}, Year: ${car.year}, Mileage: ${car.mileage}, Price: $${car.price}`;
                    searchResultsDiv.appendChild(carDiv);
                });
            } else {
                searchResultsDiv.textContent = 'No cars found matching your criteria.';
            }
        });
    }

    function validateForm(username, password, email) {
        const message = document.getElementById('form-message');

       
        const usernamePattern = /^[A-Za-z]+$/;
        if (!usernamePattern.test(username)) {
            message.textContent = "Username must contain only letters and no numbers or special characters.";
            message.style.color = 'red';
            return false;
        }

      
        if (username.toLowerCase() === email.split('@')[0].toLowerCase()) {
            message.textContent = "Username should not be the same as your email.";
            message.style.color = 'red';
            return false;
        }

       
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@?$#])[A-Za-z\d@$?#]{6,10}$/;
        if (!passwordPattern.test(password)) {
            message.textContent = "Password must be 6-10 characters long and include letters, numbers, and @, ?, $, #.";
            message.style.color = 'red';
            return false;
        }

        
        message.textContent = "";
        return true;
    }

   
    const searchIcon = document.getElementById('search-icon');
    const searchBox = document.querySelector('.search-box');
    searchIcon.addEventListener('click', function() {
        searchBox.classList.toggle('active');
    });
    
});

