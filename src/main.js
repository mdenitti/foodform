class FoodPreferencesSurvey {
    /**
     * Initializes the survey.
     *
     * Sets the initial page to 1 and the total number of pages to 4.
     * Initializes the formData object to store the user's responses.
     * Initializes session storage with the visit count.
     * Binds event listeners to the next, previous, and submit buttons.
     * Checks for and loads any existing session data.
     * Updates the progress bar.
     */
  constructor() {
      this.currentPage = 1;
      this.totalPages = 4;
      this.formData = {};
      
      // Initialize storage
      this.initializeStorage();
      
      // Bind event listeners
      this.bindEvents();
      
      // Check for existing session data
      this.loadSessionData();
      
      // Update progress bar
      this.updateProgress();
  }

  /**
   * Initializes the visit count in localStorage. If the 'visitCount' key does
   * not exist, it is created with a value of 0. The visit count is then
   * incremented by 1.
   */
  initializeStorage() {
      // Initialize localStorage with visit count
      if (!localStorage.getItem('visitCount')) {
          localStorage.setItem('visitCount', '0');
      }
      localStorage.setItem('visitCount', 
          (parseInt(localStorage.getItem('visitCount')) + 1).toString());
  }

  /**
   * Attaches event listeners to the next, previous, and submit buttons.
   * The foreach loop then attaches an event listener to each of these buttons in tha multi-verse(page) form ;)
   */
  bindEvents() {
      // Next buttons
      console.log('buttons array', document.querySelectorAll('.next-btn'));
      document.querySelectorAll('.next-btn').forEach(btn => {
          btn.addEventListener('click', () => this.nextPage());
      });

      // Previous buttons
      document.querySelectorAll('.prev-btn').forEach(btn => {
          btn.addEventListener('click', () => this.previousPage());
      });

      // Submit button
      document.getElementById('submit-btn').addEventListener('click', 
          () => this.submitForm());
  }

  /**
   * Loads any saved form data from sessionStorage and populates the form fields
   * with it. If no saved data is found, the form fields remain blank.
   */
  loadSessionData() {
      const savedData = sessionStorage.getItem('formData');
      if (savedData) {
          this.formData = JSON.parse(savedData);
          this.populateFields();
      }
  }

  /**
   * Populates the form fields with the saved data from the session storage.
   * This is called when the survey is loaded, and it populates the form with
   * the user's previous responses if they exist.
   */
  populateFields() {
      // Populate basic information
      if (this.formData.name) {
          document.getElementById('name').value = this.formData.name;
      }
      if (this.formData.email) {
          document.getElementById('email').value = this.formData.email;
      }

      // Populate dietary restrictions
      if (this.formData.dietaryRestrictions) {
          this.formData.dietaryRestrictions.forEach(restriction => {
              const checkbox = document.getElementById(restriction);
              if (checkbox) checkbox.checked = true;
          });
      }

      // Populate cuisine preferences
      if (this.formData.cuisineTypes) {
          const cuisineSelect = document.getElementById('cuisine-type');
          this.formData.cuisineTypes.forEach(cuisine => {
              Array.from(cuisineSelect.options).forEach(option => {
                  if (option.value === cuisine) option.selected = true;
              });
          });
      }

      if (this.formData.spiceLevel) {
          document.getElementById('spice-level').value = this.formData.spiceLevel;
      }
  }

  /**
   * Updates the progress bar at the top of the page. The progress bar is updated
   * based on the current page number (this.currentPage) and the total number of
   * pages (this.totalPages).
   */
  updateProgress() {
      const progress = (this.currentPage - 1) / (this.totalPages - 1) * 100;
      document.querySelector('.progress-bar').style.width = `${progress}%`;
  }

  /**
   * Collects the user input from the current page and updates the formData object.
   * The formData object is then saved to sessionStorage.
   *
   * The type of data collected depends on the current page:
   *   - On page 1, the name and email are collected.
   *   - On page 2, the selected dietary restrictions are collected.
   *   - On page 3, the selected cuisines and spice level are collected.
   */
  collectPageData() {
      switch(this.currentPage) {
          case 1:
              this.formData.name = document.getElementById('name').value;
              this.formData.email = document.getElementById('email').value;
              break;
          case 2:
              this.formData.dietaryRestrictions = [];
              ['vegetarian', 'vegan', 'gluten-free'].forEach(id => {
                  if (document.getElementById(id).checked) {
                      this.formData.dietaryRestrictions.push(id);
                  }
              });
              break;
          case 3:
              const cuisineSelect = document.getElementById('cuisine-type');
              this.formData.cuisineTypes = Array.from(cuisineSelect.selectedOptions)
                  .map(option => option.value);
              this.formData.spiceLevel = document.getElementById('spice-level').value;
              break;
      }

      // Save to sessionStorage
      sessionStorage.setItem('formData', JSON.stringify(this.formData));
  }

  /**
   * Checks if the current page is valid. The page is valid if all required fields
   * are filled in. If the page is invalid, an alert is shown and the page is not
   * advanced.
   *
   * @returns {boolean} true if the page is valid, false otherwise.
   */
  validatePage() {
      // All pages are valid without any validation
      return true;
  }

  /**
   * Advances to the next page of the form. If the current page is not valid (i.e.
   * `validatePage()` returns false), an alert is shown and the page is not
   * advanced. If the current page is valid, all form data from the current page
   * is collected and saved to sessionStorage, and the next page is shown.
   *
   * If the next page is the summary page (i.e. the last page), the summary is
   * displayed.
   *
   * @returns {undefined} 
   */
  nextPage() {
      if (!this.validatePage()) {
          alert('Please fill in all required fields.');
          return;
      }

      this.collectPageData();
      
      if (this.currentPage < this.totalPages) {
          document.getElementById(`page${this.currentPage}`).style.display = 'none';
          this.currentPage++;
          document.getElementById(`page${this.currentPage}`).style.display = 'block';
          
          if (this.currentPage === this.totalPages) {
              this.displaySummary();
          }
          
          this.updateProgress();
      }
  }

  /**
   * Goes back to the previous page of the form. If the current page is 1, this
   * does nothing. Otherwise, it hides the current page and shows the previous
   * page, and updates the progress bar.
   *
   * @returns {undefined} 
   */
  previousPage() {
      if (this.currentPage > 1) {
          document.getElementById(`page${this.currentPage}`).style.display = 'none';
          this.currentPage--;
          document.getElementById(`page${this.currentPage}`).style.display = 'block';
          this.updateProgress();
      }
  }

  /**
   * Displays the summary of the form data on the final page.
   *
   * The summary is an HTML string that displays the user's name, email,
   * dietary restrictions, favorite cuisines, and spice level. The summary
   * is displayed in the element with the id 'summary-content'.
   *
   * @returns {undefined} 
   */
  displaySummary() {
      const summaryHTML = `
          <h4>Personal Information</h4>
          <p>Name: ${this.formData.name}</p>
          <p>Email: ${this.formData.email}</p>
          
          <h4>Dietary Restrictions</h4>
          <p>${this.formData.dietaryRestrictions.length ? 
              this.formData.dietaryRestrictions.join(', ') : 'None'}</p>
          
          <h4>Cuisine Preferences</h4>
          <p>Favorite Cuisines: ${this.formData.cuisineTypes.join(', ')}</p>
          <p>Spice Level: ${this.formData.spiceLevel}/5</p>
      `;
      
      document.getElementById('summary-content').innerHTML = summaryHTML;
  }

  /**
   * Submits the form data to the server.
   *
   * This method sends a POST request to the server with the form data. If the
   * request is successful, the session storage is cleared, and the user is
   * redirected to the /thank-you.html page. If the request fails, an error
   * message is displayed to the user.
   *
   * @returns {Promise<void>} A promise that resolves when the request is complete.
   */
  async submitForm() {
      try {
          // Example API endpoint (replace with your actual endpoint)
          const response = await fetch('https//localhost:3000/food', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.formData)
          });

          if (response.ok) {
              // Clear session storage after successful submission
              sessionStorage.removeItem('formData');
              
              // Save completion status to localStorage
              localStorage.setItem('surveyCompleted', 'true');
              
              alert('Thank you for submitting your food preferences!');
              window.location.href = '/thank-you.html';
          } else {
              throw new Error('Submission failed');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('There was an error submitting your preferences. Please try again.');
      }
  }
}

new FoodPreferencesSurvey();
