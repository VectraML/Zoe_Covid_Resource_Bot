window.twttr = (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function (f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Zoe";
const PERSON_NAME = "You";

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


const hints = ["I need oxygen in ", "I need a hospital bed in ", "I'm looking for medicines", "I want to know about vaccinations", "I need blood plasma in ", "I am looking for oxygen in "];
const cities = ["Mumbai", "Delhi", "Bangalore", "Bareilly", "Agra", "Pune", "Jaipur", "Ahmedabad", "Hyderabad", "Kolkata", "Chennai", "Gurgaon", "Gurugram", "Surat", "Lucknow",
"Chandigarh", "Indore", "Patna", "Vishakapatnam", "Kanpur", "Varanasi", "Amritsar", "Vadodara",
"Kochi", "Coimbatore", "Nagpur", "Noida", "Faridabad", "Ghaziabad", "Rajkot", "Nashik", "Jodhpur",
"Bhubaneswar", "Udaipur", "Guwahati", "Ludhiana", "Raipur", "Meerut", "Prayagraj", "Gwalior", "Thane"];
const medicines = ["Remdesivir", "Dexamethasone", "Azithromycin", "Hydroxychloroquine",
"Chloroquine", "Tocilizumab", "Kaletra", "Ivermectin", "Favipiravir", "Fabiflu", "Cipremi"];

autocomplete(document.getElementById("chatbot_input"), hints);

const buttonQueries = {
    "Oxygen": "I'm looking for oxygen",
    "Hospital Beds": "I'm looking for hospital beds",
    "Medicine": "I'm looking for medicines",
    "Vaccine": "I'm looking for information about vaccinations",
    "BloodPlasma": "I'm looking for blood plasma"
};

function scrollToDivision(div_id) {
    $('html, body').animate({
        scrollTop: $('#' + div_id).offset().top
    }, 'smooth');
    return false;
}

function pingChatbot(keyword) {
    scrollToDivision("chatbot");
    appendMessage(PERSON_NAME, PERSON_IMG, "right", buttonQueries[keyword]);
    send(buttonQueries[keyword])
}



function send(message) {
    console.log("User Message:", message)
    $.ajax({
        url: 'https://67b676c7b1cf.ngrok.io/webhooks/rest/webhook',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "message": message,
            "sender": "username"
        }),
        success: function (data, textStatus) {
            console.log(data);
            if (data.length < 1) {
                botResponse("I couldn\'t get that. Try asking in the format:")
                botResponse("I'm looking for [oxygen/resdesvir/hospital bed] in [location]")
            } else {
                console.log(data);
                botResponse(data[0]["text"]);
                console.log("Rasa Response: ", data, "\n Status:", textStatus)

                // If all the slots are filled

                switch (data[0]["text"]) {

                    case "Please Wait! Results will be displayed soon":
                        scraperCall(data[1]["text"]);
                        break;

                    case "Can you please provide us with your location?":
                        autocomplete(document.getElementById("chatbot_input"), cities);
                        break;

                    case "Which medicine are you looking for?":
                        autocomplete(document.getElementById("chatbot_input"), medicines);
                        break;

                    default:
                        autocomplete(document.getElementById("chatbot_input"), []);
                }

            }
        },
        error: function (errorMessage) {
            botResponse("");
            console.log('Error' + errorMessage);
        }
    });
}


msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";

    send(msgText);

});

function replaceURLs(message) {
    if (!message) return;

    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, function (url) {
        var hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
        }
        return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
    });
}

function appendMessage(name, img, side, text) {

    var message = replaceURLs(text);

    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${message}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse(message) {

    const delay = message.split() * 100;

    setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", message);
    }, delay);
}


function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}

async function scraperCall(message) {

    scrollToDivision("resources");
    
    var y = document.getElementById("loader");
    y.style.margin = "15vh";
    y.style.display = "block";
    y.style.verticalAlign = "middle";
    console.log(y);
    
    var x = document.getElementById("tweets");
    x.style.display = "flex";
    
    console.log("User Message:", message)
    $.ajax({
        url: 'http://localhost:5000/tweets/', // Insert URL here
        type: 'POST',
        contentType: 'application/json', // Define and check the data format coming in
        data: JSON.stringify({
            "message": message,
        }),
        success: function (data, textStatus) {
            if (data.length < 1) {
                console.log("Error");
            } else {
                scraperDisplay(data)
            }
        },
        error: function (errorMessage) {
            botResponse("");
            var newMessage = message.substring(0, message.lastIndexOf("AND"));
            console.log("New Message")
            scraperCall(newMessage);
            console.log('Error' + errorMessage);

        }
    });
    
}

async function scraperDisplay(data) {
    
    
    twttr.ready(function (twttr) {
        twttr.events.bind('tweet', function (e) {
            if (!e) return;
            ga('send', 'social', 'twitter', 'tweet', theURL);
        })
    });

    jsonData = JSON.parse(data);
    var count = Object.keys(jsonData).length;
    for (var i = 0; i < 2; i++) {
        twttr.widgets.createTweet(
            jsonData[i],
            document.getElementById('container'), {
                theme: 'light'
            }
        );
    }

    var x = document.getElementById("container");
    x.style.display = "block";
    x.style.height = "50rem";
    x.style.overflowX = "hidden";
    x.style.overflowY = "scroll";
    
    var y = document.getElementById("loader");
    y.style.display = "none";
    
    clearcontent("container");
}

function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        a.style.zIndex = "9999";
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                var idx = arr[i].toUpperCase().includes(val.toUpperCase()); // Get index of the substring
                b = document.createElement("div");
                b.innerHTML = arr[i].substr(0, idx + 1);
                b.innerHTML += "<strong style='margin:0;padding:0;'>" + arr[i].substr(idx, val.length + 1).trim() + "</strong>";
                b.innerHTML += arr[i].substr(idx + val.length + 1);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 9) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function CopyToClipboard(containerid) {
    if (document.selection) {
        document.selection.empty();
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
        
    } 
    else if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }
}

//scraperDisplay(data);

//scraperCall("Kalyan AND Remdesvir AND Verified")
