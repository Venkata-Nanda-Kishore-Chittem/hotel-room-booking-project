gsap.registerPlugin(TextPlugin);

// Set up event listener for window load
window.onload = function() {
  const today = new Date().toISOString().slice(0,10);
  const tomorrow = new Date().toISOString().slice(0,10);

  // Set input values for check-in and check-out dates
  document.querySelector("#check_in").value = today;
  document.querySelector("#check_out").value = tomorrow;

  const tl = gsap.timeline();

  tl.fromTo("body", {
    opacity: 0,
    scale: 0
  }, {
    opacity: 1,
    scale: 1,
    duration: 2
  }
  ).to("#name", {
    duration: 3,
    text: {
        value: "WELCOME TO THE STARLIGHT HAVEN HOTEL !!!",
        oldClass: "oldClass",
        newClass: "newClass"
    }
  }
  ).fromTo(".col-12", {
    scale: 0,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    duration: 1.5
  })
}

// Set up event listener for button click
document.querySelector("button").onclick = function() {
  // Get check-in and check-out dates from input values
  const fd = document.querySelector("#check_in").value;
  const td = document.querySelector("#check_out").value;

  var ms = new Date();
  ms = new Date(td) - new Date(fd);
  let days = Math.round(ms)/(1000*60*60*24);

  // Get room type from radio buttons
  var deluxe = document.querySelector("#deluxe");
  var ac = document.querySelector("#ac");
  var non_ac = document.querySelector("#non_ac");

  var r_type, bill, total_bill, cgst, sgst;

  // Determine room type based on checked radio button
  if (deluxe.checked) r_type = "DELUXE";
  if (ac.checked) r_type = "AC";
  if (non_ac.checked) r_type = "NON_AC";

  // Get number of adults, children, and additional adults and children
  let adults = parseInt(document.querySelector("#no_of_adults").value);
  let children = parseInt(document.querySelector("#no_of_children").value);
  let ad_adults = parseInt(document.querySelector("#no_of_ad_adults").value);
  let ad_children = parseInt(document.querySelector("#no_of_ad_children").value);

  // Calculate total number of people
  let people = adults + children + ad_adults + ad_children;

  // Check if check-out date is later than check-in date
  if (td > fd) {
    // Check if number of people exceeds 5
    if (people > 5) {
      alert("NO.OF PEOPLE EXCEEDED");
      return;
    } else {
      // Calculate GST (Goods and Services Tax)
      function gst(fare) {
        cgst = fare * (5/100);
        sgst = fare * (5/100);
        return cgst + sgst;
      }

      // Calculate bill based on room type and number of days
      if ((adults != 0 || children != 0) && (adults <= 2 && children <=2)) {
        if (r_type == "DELUXE") {
          bill = days * 7000;
          total_bill = bill + (ad_adults * 2000) + (ad_children * 1000);
          total_bill = total_bill + gst(total_bill);
        }

        if (r_type == "AC") {
          bill = days * 3500;
          total_bill = bill + (ad_adults * 1000) + (ad_children * 500);
          total_bill = total_bill + gst(total_bill);
        }

        if (r_type == "NON_AC") {
          bill = days * 1500;
          total_bill = bill + (ad_adults * 500) + (ad_children * 300);
          total_bill = total_bill + gst(total_bill);
        }

      } else {
        alert("Please enter number of adults and children properly");
        return;
      }
    }
    // Display result in HTML container
    let result = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true"> 
      <div class="modal-dialog border border-2 border-white rounded-2" role="document"> 
        <div class="modal-content"> 
          <div class="modal-header bg-dark text-white"> 
            <h5 class="modal-title fw-semibold mx-auto" id="modalTitleId"> 
              TOTAL BILL 
            </h5> 
          </div> 
          <div class="modal-body bg-black"> 
            <div class="container-fluid text-center"> 
                <p>CHECK IN DATE : ${fd}</p>            
                <p> CHECK OUT DATE : ${td}</p>                 
                <p> NO. OF DAYS BOOKED: ${days} </p>        
                <p> TYPE OF ROOM : ${r_type}</p>   
                <p>TOTAL NO.OF PEOPLE: ${people}</p>
                <p> NO.OF ADULTS : ${adults}</p>           
                <p> NO.OF CHILDREN : ${children}</p>             
                <p>NO.OF ADDITIONAL ADULTS : ${ad_adults}</p>      
                <p> NO.OF ADDITIONAL CHILDREN : ${ad_children}</p>                         
                <p> SGST : &#8377; ${sgst}</p>           
                <p> CGST : &#8377; ${cgst}</p>   
                <p class="fw-bold w-50 p-2 rounded-2 mx-auto">BILL : &#8377; ${total_bill}</p> 
            </div> 
          </div> 
          <div class="modal-footer bg-dark"> 
            <button type="button" class="btn btn-light mx-auto w-25 fw-semibold" data-bs-dismiss="modal"> 
              CLOSE 
            </button> 
          </div> 
        </div> 
      </div> 
    </div>
    `;

    document.querySelector("#modal").innerHTML = result;
    // Show the modal
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();
  } else {
    alert("CHOOSE A VALID DATE PLEASE !!!")
  }
}