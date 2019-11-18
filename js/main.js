document.addEventListener("DOMContentLoaded", function() {
  //Select the Elements
  var clear = document.querySelector(".clear");
  var list = document.querySelector("#list");

  //variables
  var LIST = [];
  id = 0;

  //Classes name
  var CHECK = "fa-check-circle";
  var UNCHECK = "fa-circle-thin";
  var LINE_THROUGH = "lineThrough";

  //get item from local storage
  var data = localStorage.getItem("TODO");
  // check if the data is not empty
  if (data) {
    LIST = JSON.parse(data);
    id = LIST.length; //set the id to the last one in the list
    loadList(LIST); //load the list to the user interface
  } else {
    LIST = [];
    id = 0;
  }
  // document.querySelector(".totalToDo").innerHTML = id;

  // function to add numbers to counter
  // function dynamicCounter() {
  //   document.querySelector(".totalToDo").innerHTML = id;
  // }
  // dynamicCounter();
  //
  //FUNCTION (1)----------------------------------------------------
  //load items to the user's interface
  function loadList(array) {
    array.forEach(function(item) {
      addToDo(item.name, item.id, item.done, item.trash);
    });
    updateCounter();
    update();
    progressBarCounter();
  }

  //clear the local storage

  clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
  });

  //Show Today's Date
  var dateElement = document.getElementById("date");
  var options = { weekday: "long", month: "short", day: "numeric" };
  var today = new Date();
  dateElement.innerHTML = today.toLocaleDateString("en-us", options);

  //FUNCTION (2)-----------------------------------------------------------------------
  //add-to-do function
  function addToDo(todo, id, done, trash) {
    if (trash) {
      return;
    }
    var DONE = done ? CHECK : UNCHECK;
    var LINE = done ? LINE_THROUGH : "";
    var item = `<li class= "flex-row align-items-center">
            <i class="fa ${DONE} co fa-2x" job="complete" id="${id}"></i>
            <p class="text ${LINE} mr-rt-auto font-size-1-rem mr-lt-2-rem "
              >${todo}</p
            >
            <i class="fa fa-trash-o de fa-2x" job="delete" id="${id}"></i>
          </li>`;
    var position = "beforeend";
    list.insertAdjacentHTML(position, item);
  }

  // ----------------------------------------------------- REALLY WANTED TO DO THIS
  // function verifyItem() {
  document.querySelector("button").addEventListener("click", function() {
    var input = document.getElementById("input");
    var todo = input.value;

    // if inputValue is not empty
    if (todo) {
      addToDo(todo, id, false, false);
      LIST.push({
        name: todo,
        id: id,
        done: false,
        trash: false
      });
      //add item to local storage(THIS CODE MUST BE ADDED WHERE THE LIST ARRAY IS UPDATED)
      localStorage.setItem("TODO", JSON.stringify(LIST));
      updateCounter();
      update(); // document.querySelector(".totalToDo").innerHTML = id;
      progressBarCounter();
      id++;
    } else {
      alert("please enter your list");
    }
    input.value = "";
  });

  //FUNCTION (3)-------------------------------------------------------------
  //function to toggle the classes to check and uncheck
  function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false : true;
    var newDoneList = [];
    console.log(LIST.length);

    for (i = 0; i <= LIST.length; i++) {
      if (LIST[element.id].done) {
        newDoneList.length == i;
        console.log(newDoneList.length);
        document.querySelector(".alreadyDone").innerHTML = newDoneList.length;
        console.log(newDoneList.length);
      }
    }
    updateCounter();
    update();
    progressBarCounter();
  }

  //FUNCTION (4)-------------------------------------------------------------
  //function remove to do
  function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
    updateCounter();
    update();
    progressBarCounter();
  }

  //target the items created dynamically
  list.addEventListener("click", function(event) {
    var element = event.target; //return the clicked element inside list
    var elementJob = element.attributes.job.value;
    //complete or delete
    if (elementJob == "complete") {
      completeToDo(element);
    } else if (elementJob == "delete") {
      removeToDo(element);
    }
    //add item to local storage(THIS CODE MUST BE ADDED WHERE THE LIST ARRAY IS UPDATED)
    localStorage.setItem("TODO", JSON.stringify(LIST));
  });

  //FUNCTION (5)--------------------------------------------------
  //FOR PROGRESS BAR
  function update() {
    var progress = document.getElementById("myprogressBar");
    var currentWidth = 0;
    var width = (completedAmount() / totalAmount()) * 100;
    var id = setInterval(frame, 30);
    function frame() {
      if (currentWidth >= width) {
        clearInterval(id);
      } else if (currentWidth == 0) {
        document.getElementById("myprogressBar").style.innerHTML = "";
      } else {
        currentWidth++;
        progress.style.width = currentWidth + "%";
      }
    }
  }
  update();
  //dynamic counter
  function updateCounter() {
    document.querySelector(".totalToDo").innerHTML = totalAmount();
    document.querySelector(".alreadyDone").innerHTML = completedAmount();
  }
  function completedAmount() {
    return LIST.filter(item => {
      return item.done && !item.trash;
    }).length;
  }

  function totalAmount() {
    return LIST.filter(item => {
      return !item.trash;
    }).length;
  }

  function progressBarCounter() {
    completedAmount();
    document.getElementById("myprogressBar").innerHTML = LIST.length;
  }
});
