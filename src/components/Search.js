import {
  BASE_API_URL,
  searchInputEl,
  searchFormEl,
  jobListSearchEl,
  numberEl,
} from "../common.js";

import renderSpinner from "./Spinner.js";

import renderError from "./Error.js";
import renderJobList from "./JobList.js";

const submitHandler = async (event) => {
  //prevent default behaviour
  event.preventDefault();

  // get search text
  const searchText = searchInputEl.value;

  // validation (regex example)
  const forbiddenPattern = /[0-9]/;
  const patternMatch = forbiddenPattern.test(searchText);
  if (patternMatch) {
    renderSpinner("search");
    renderError("Your search cannot contain numbers!");
    return;
  }

  searchInputEl.blur();
  // remove previous job items
  jobListSearchEl.innerHTML = "";

  // render spinner

  renderSpinner("search");

  // fetch search results
  try {
    const response = await fetch(`${BASE_API_URL}/jobs?search=${searchText}`);
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.description);
    }

    const { jobItems } = data;

    // remove spinner
    renderSpinner("search");
    //render number of results
    numberEl.textContent = jobItems.length;
    renderJobList(jobItems);
  } catch (error) {
    renderSpinner("search");
    renderError(error.message);
  }

  // fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Resoure issue or server issue");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     //   extract job items
  //     const { jobItems } = data;

  //     // remove spinner
  //     renderSpinner("search");
  //     //render number of results
  //     numberEl.textContent = jobItems.length;
  //     renderJobList(jobItems);
  //   })
  //   .catch((error) => {
  //     renderSpinner("search");
  //     renderError(error.message);
  //   });
};
searchFormEl.addEventListener("submit", submitHandler);
