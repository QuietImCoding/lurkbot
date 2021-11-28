// find_lurk.js
// finds lurkers and creates a leaderboard for users in a twitter gc
// awful hack, pls do not ever use
// so bad you need to run it twice ( its a feature not a bug! [its a bug] ) 

// set your own twitter url
var self_handle = '@?????????'; // better change this 

// attempts to count up user messages lmao
var updateUsers = function( outset ) {
    Array.from(document.querySelectorAll('a'))
	.filter(x => x.style.width == '40px')
	.forEach(function(x) {
	    var handle = x.href.replace('https://twitter.com/', '@');
	    if (outset[handle] == undefined) { outset[handle] = 1; }
	    else { outset[handle] += 1 }
	});
}

// used to PRE-CACHE the chat participants for future reference
// seems to work very sporadically i cry 
var get_participants = async function() {
    var info_btn = Array.from(document.querySelectorAll('a')).filter(x => x.href.includes('/info'));
    info_btn[0].click();
    var part_btn = Array.from(document.querySelectorAll('a')).filter(x => x.href.includes('/participants'));
    part_btn[0].click();
    var back_btn = document.querySelector('div.r-2yi16');
    var promise = new Promise(function(resolve, reject) {
	setTimeout( function() {
	    // after the page loads a bit, scroll to bottom and save all the urls
	    var scrollbox = document.querySelector('section.css-1dbjc4n:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
	    scrollbox.scrollTo(0,1e5)
	    resolve(Array.from(document.querySelectorAll('a')).filter(x => x.style.height == '48px').map(x => x.href.replace('https://twitter.com/', '@')));
	    back_btn.click();
	    back_btn.click();
	}, 1000);
    });
    return promise;
}

// pre-calculate participants
var parts = await get_participants();
var userset = new Object();
// after we get back here, give a second to load thingies
setTimeout( function() {
    // get top bar to shove a button in 
    var chatname = document.getElementById("detail-header").firstChild.innerText;
    var scrollbox = document.querySelector('.r-ouzzow')
    var chlen = function() {scrollbox.scrollTo(0,1);}
    // scroll up to update users every 1/10th of a second... computer go zoom
    var scrapetimer = setInterval(function() { updateUsers( userset ) }, 100);
    var btn = document.createElement('button');
    btn.innerHTML = "Get Lurkers";
    // make button do things
    btn.addEventListener("click", x => {
	// i have infinite interaction and u cannot prove me wrong 
	userset[self_handle] = Infinity;
	parts.push(self_handle);
	var lurkers = parts.filter(x => !Object.keys(userset).includes(x) );
	// sort to get a leaderboard mwahahahah
	var res_str = Object.entries(userset).sort().sort(([,a],[,b]) => a-b).reverse().reduce((a,b) => a + '\n' + b);
	// make a string with lurkers
	var lurk_str = ""; lurkers.forEach(x => lurk_str += x + '\n')
	var outstr = "Lurkers:\n\n" + lurk_str + '\n\nLeaderboard:\n\n' + res_str;
	// alerting is good, actually
	alert(outstr);
    });
    document.getElementById("detail-header").appendChild(btn)
    // we scroll up every 500 millisecond... don't ask why i picked these numbers 
    var lentimer = setInterval(chlen, 500);
}, 1000);
