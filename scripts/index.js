const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channel = urlParams.get('channel');
const mode = urlParams.get('mode') || "word";
console.log(mode);

word_scores = {}
message_scores = {}

list = document.getElementById('list');

// CONNECT TO TWITCH CHAT
const client = new tmi.Client({
    channels: [channel]
});

client.connect();
client.on('message', async (channel, tags, message, self) => {
    //console.log(`${tags['display-name']}: ${message}`);
    message = message.toLowerCase()

    if (message in message_scores) {
        message_scores[message] += 1
    } else {
        message_scores[message] = 1
    }

    words = message.split(" ")

    for (word of words) {
        if (word in word_scores) {
            word_scores[word] += 1
        }
        else {
            word_scores[word] = 1
        }

    }

    scores = []
    if (mode === "word") {
        scores = word_scores
    } else if (mode === "message") {
        scores = message_scores
    }

    let res = Object.keys(scores).map((key) => [key, scores[key]]);

    res.sort(function (a, b) {
        return b[1] - a[1];
    });
    res = res.slice(0, 10);
    console.log(res)

    items = []
    for (el of res) {
        let item = document.createElement("div")
        item.classList.add("item")

        let name = document.createElement("div")
        name.classList.add("item-name")
        name.appendChild(document.createTextNode(el[0]))
        item.appendChild(name)

        let score = document.createElement("div")
        score.classList.add("item-score")
        score.appendChild(document.createTextNode(el[1]))
        item.appendChild(score)

        items.push(item);
    }
    list.replaceChildren(...items);
});



