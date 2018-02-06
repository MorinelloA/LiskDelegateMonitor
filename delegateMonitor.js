var delegateInfo = [];
var delegateGroups = {
    elite:['carbonara', 'luiz', 'iii.element.iii', 'spacetrucker', 'acheng', 'badman0316', 'leo', 'rooney', 'bigfisher', 'liskjp',
    'will', 'panzer', 'xujian', 'eastwind_ja', 'grajsondelegate', 'mrgr', 'adrianhunter', 'luxiang7890', 'crodam', 'honeybee',
    'phinx', 'seven', 'liskroad', 'chamberlain', 'someonesomeone', 'savetheworld', 'lwyrup', 'luukas', 'carolina', 'hua', 'mac',
    'augurproject', 'forger_of_lisk', 'crolisk', 'veriform', 'goodtimes', 'zy1349', 'yuandian', 'hong', 'bilibili', 'dakini',
    'loveforever', 'cai', 'bigtom', 'jixie', 'blackswan', 'khitan', 'jiandan', 'menfei', 'china', 'kaystar', 'kc', 'catstar', 
    'threelittlepig', 'elonhan'],
    sherwood:['robinhood', 'liberspirita', 'liskpro.com'],
    GDT:['4miners.net','5an1ty','alepop','bioly','cc001','corsaro','dakk','eclipsun','forrest','gdtpool','goldeneye','gr33ndrag0n',
    'grumlin','hagie','hmachado','joel','joo5ty','kushed.delegate','liskgate','liskit','mrv','nerigal','ntelo','ondin','philhellmuth',
    'punkrock','redsn0w','sgdias','slasheks','splatters','tembo','vekexasia','vi1son'],
    liskbuilders:['liskit', 'dakk', 'vekexasia', '5an1ty', 'cc001', 'gr33ndrag0n', 'mrv', 'alepop', '4fryn', 'carbonara', 'liskpro.com', 'joo5ty', 'thepool', 'bioly', 'philhellmuth', 'endro'],
    LIG:['dakk', 'liskit', 'anamix', 'corsaro', 'splatters', 'redsn0w', 'gregorst', 'ondin', 'vekexasia', 'fulig'],
    dutch:['dutch_pool', 'kippers', 'thamar', 'fnoufnou', 'st3v3n']
};

function start(){
    fetch('https://wallet.mylisk.com/api/delegates?limit=101&orderBy=rank:asc')
    .then(res => res.json())
    .then((out) => {
        SetAllDelegatesHelper(out);
    }).catch(err => console.error(err));

    fetch('https://wallet.mylisk.com/api/delegates?limit=99&offset=101&orderBy=rank:asc')
    .then(res2 => res2.json())
    .then((out2) => {
        SetAllInactiveDelegatesHelper(out2);
    }).catch(err2 => console.error(err2));
}

function SetAllInactiveDelegatesHelper(delegates){
    for(var i=101; i< delegates.delegates.length + 101; i++)
    {
        delegateInfo[i] = {};
        delegateInfo[i].username = delegates.delegates[i-101].username;
        delegateInfo[i].address = delegates.delegates[i-101].address;
        delegateInfo[i].publicKey = delegates.delegates[i-101].publicKey;
        delegateInfo[i].voteweight = delegates.delegates[i-101].vote / 100000000;
        delegateInfo[i].producedblocks = delegates.delegates[i-101].producedblocks;
        delegateInfo[i].missedblocks = delegates.delegates[i-101].missedblocks;
        delegateInfo[i].approval = delegates.delegates[i-101].approval;
        delegateInfo[i].productivity = delegates.delegates[i-101].productivity;
        lskforged(delegateInfo[i].publicKey, i);
        delegateInfo[i].groups = [];
        insertDelegateGroups(i);
    }
    popIn();
}

function popAct()
{
    setTimeout(function() {
        let inactiveBool = checkActive();
        if(inactiveBool)
        {
            populateDelegateTables();
        }
        else{
            popAct();
        }
    }, 500);
}

function popIn()
{
    setTimeout(function() {
        let inactiveBool = checkInactive();
        if(inactiveBool)
        {
            //populateInactiveDelegateTables();
        }
        else{
            popIn();
        }
    }, 500);
}

function checkActive(){
    let tempBool = true;
    for(let i = 0; i < 101; i++)
    {
        if(isNaN(delegateInfo[i].forged))
        {
            tempBool = false;
        }
    }
    return tempBool;
}

function checkInactive(){
    let tempBool = true;
    for(let i = 101; i < 200; i++)
    {
        if(isNaN(delegateInfo[i].forged))
        {
            tempBool = false;
        }
    }
    return tempBool;
}

function populateInactiveDelegateTables(){
    var delegateTable = document.getElementById("inactiveDelegateTable");

    for(let i=101; i<200; i++)
    {
        let row = delegateTable.insertRow(i - 100);

        var cell1 = row.insertCell(0);
        cell1.innerHTML = (i + 1);
        
        var a = document.createElement('a');
        var linkText = document.createTextNode(delegateInfo[i].username);
        a.appendChild(linkText);
        a.title = 'https://explorer.lisk.io/delegate/' + delegateInfo[i].address;
        a.href = 'https://explorer.lisk.io/delegate/' + delegateInfo[i].address;

        var cell2 = row.insertCell(1);
        cell2.appendChild(a);

        var cell3 = row.insertCell(2);
        cell3.innerHTML = Number(delegateInfo[i].voteweight).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell4 = row.insertCell(3);
        cell4.innerHTML = Number(delegateInfo[i].producedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell5 = row.insertCell(4);
        cell5.innerHTML = Number(delegateInfo[i].missedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell6 = row.insertCell(5);
        cell6.innerHTML = Number(delegateInfo[i].approval).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        ) + '%';

        var cell7 = row.insertCell(6);
        cell7.innerHTML = Number(delegateInfo[i].productivity).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        ) + '%';

        var cell8 = row.insertCell(7);
        cell8.innerHTML = Number(delegateInfo[i].forged).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell9 = row.insertCell(8);
        cell9.innerHTML = getDelegateGroups(i);
    }
}

function SetAllDelegatesHelper(delegates){
    for(let i=0; i< delegates.delegates.length; i++)
    {
        delegateInfo[i] = {};
        delegateInfo[i].rank = i + 1;
        delegateInfo[i].username = delegates.delegates[i].username;
        delegateInfo[i].address = delegates.delegates[i].address;
        delegateInfo[i].publicKey = delegates.delegates[i].publicKey;
        delegateInfo[i].voteweight = delegates.delegates[i].vote / 100000000;
        delegateInfo[i].producedblocks = delegates.delegates[i].producedblocks;
        delegateInfo[i].missedblocks = delegates.delegates[i].missedblocks;
        delegateInfo[i].approval = delegates.delegates[i].approval;
        delegateInfo[i].productivity = delegates.delegates[i].productivity;
        lskforged(delegateInfo[i].publicKey, i);
        delegateInfo[i].groups = [];
        insertDelegateGroups(i);
    }
    popAct();
}

function populateDelegateTables(){
    var delegateTable = document.getElementById("delegateTable");
    var parentDiv = document.getElementById('delegateDropdowns');

    var d0 = document.createElement("div");
    //d0.setAttribute("class", "card-header collapsed");
    d0.setAttribute("class", "card-header");
    d0.setAttribute("content", "\2213", "important");
    //d0.setAttribute("data-toggle", "collapse");
    //d0.setAttribute("data-parent", "#accordion1");
    //d0.setAttribute("href", "#collapse" + i);

    var a0 = document.createElement("a");
    a0.setAttribute("class", "card-title");

    var innerDivRank0 = document.createElement("label");
    innerDivRank0.setAttribute("class", "rankColumn");
    innerDivRank0.innerHTML = "Rank";

    var innerDivName0 = document.createElement("label");
    innerDivName0.setAttribute("class", "nameColumn");
    innerDivName0.innerHTML = "Name";

    var innerDivVoteWeight0 = document.createElement("label");
    innerDivVoteWeight0.setAttribute("class", "voteWeightColumn");
    innerDivVoteWeight0.innerHTML = "Vote Weight";

    var innerDivProducedBlocks0 = document.createElement("label");
    innerDivProducedBlocks0.setAttribute("class", "producedBlocksColumn");
    innerDivProducedBlocks0.innerHTML = "Produced Blocks";

    var innerDivMissedBlocks0 = document.createElement("label");
    innerDivMissedBlocks0.setAttribute("class", "missedBlocksColumn");
    innerDivMissedBlocks0.innerHTML = "Missed Blocks";

    var innerDivApproval0 = document.createElement("label");
    innerDivApproval0.setAttribute("class", "approvalColumn");
    innerDivApproval0.innerHTML = "Approval %";

    var innerDivProductivity0 = document.createElement("label");
    innerDivProductivity0.setAttribute("class", "productivityColumn");
    innerDivProductivity0.innerHTML = "Productivity %";

    var innerDivForged0 = document.createElement("label");
    innerDivForged0.setAttribute("class", "forgedColumn");
    innerDivForged0.innerHTML = "Forged";

    var innerDivGroups0 = document.createElement("label");
    innerDivGroups0.setAttribute("class", "groupsColumn");
    innerDivGroups0.innerHTML = "Groups";

    a0.appendChild(innerDivRank0);
    a0.appendChild(innerDivName0);
    a0.appendChild(innerDivVoteWeight0);
    a0.appendChild(innerDivProducedBlocks0);
    a0.appendChild(innerDivMissedBlocks0);
    a0.appendChild(innerDivApproval0);
    a0.appendChild(innerDivProductivity0);
    a0.appendChild(innerDivForged0);
    a0.appendChild(innerDivGroups0);
    d0.appendChild(a0);

    parentDiv.appendChild(d0);

    for(var i=0; i<101; i++)
    {
        /*let row = delegateTable.insertRow((i * 2));
        row.setAttribute("data-toggle", "collapse");
        //row.setAttribute("data-target", "#accordion" + i);
        row.setAttribute("data-parent", "#delegateTable");
        row.setAttribute("class", "clickable");
        row.setAttribute("href", "#collapse" + i);

        var cell1 = row.insertCell(0);
        cell1.innerHTML = (i + 1);

        var a = document.createElement('a');
        var linkText = document.createTextNode(delegateInfo[i].username);
        a.appendChild(linkText);
        a.title = 'https://explorer.lisk.io/delegate/' + delegateInfo[i].address;
        a.href = 'https://explorer.lisk.io/delegate/' + delegateInfo[i].address;

        var cell2 = row.insertCell(1);
        cell2.appendChild(a);

        var cell3 = row.insertCell(2);
        cell3.innerHTML = Number(delegateInfo[i].voteweight).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell4 = row.insertCell(3);
        cell4.innerHTML = Number(delegateInfo[i].producedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell5 = row.insertCell(4);
        cell5.innerHTML = Number(delegateInfo[i].missedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell6 = row.insertCell(5);
        cell6.innerHTML = Number(delegateInfo[i].approval).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        ) + '%';

        var cell7 = row.insertCell(6);
        cell7.innerHTML = Number(delegateInfo[i].productivity).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        ) + '%';

        var cell8 = row.insertCell(7);
        cell8.innerHTML = Number(delegateInfo[i].forged).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var cell9 = row.insertCell(8);
        cell9.innerHTML = getDelegateGroups(i);


        let row2 = delegateTable.insertRow((i * 2) + 1);
        //row2.setAttribute("colspan", "9");

        //let newTD = row2.insertCell(0);
        //newTD.setAttribute("colspan", "9");
        //newTD.setAttribute("height", "0px");
        //newTD.setAttribute("padding", "0px");
        //newTD.setAttribute("margin", "0px");
        //newTD.setAttribute("border", "0px");

        var d1 = document.createElement("td");
        //d1.setAttribute("id", "accordion" + i);
        d1.setAttribute("id", "collapse" + i);
        d1.setAttribute("class", "collapse");
        d1.setAttribute("colspan", "9", "important");
        var testText = document.createTextNode("Testing 1.2.3. lkjfl kerfjl krejg lrgho54i ghrkei hjl rkeigjl rjg krjg 4kj ");
        d1.appendChild(testText);

        //row2.appendChild(d1);
        //newTD.appendChild(d1);
        row2.appendChild(d1);
        */
        //
        //
        //
        //
        //
        
        //
        var d1 = document.createElement("div");
        d1.setAttribute("class", "card-header collapsed test");
        d1.setAttribute("data-toggle", "collapse");
        d1.setAttribute("data-parent", "#accordion1");
        d1.setAttribute("href", "#collapse" + i);

        var a1 = document.createElement("a");
        a1.setAttribute("class", "card-title");

        var innerDivRank = document.createElement("label");
        innerDivRank.setAttribute("class", "rankColumn");
        innerDivRank.innerHTML = delegateInfo[i].rank;

        var innerDivName = document.createElement("label");
        innerDivName.setAttribute("class", "nameColumn");
        innerDivName.innerHTML = delegateInfo[i].username;

        var innerDivVoteWeight = document.createElement("label");
        innerDivVoteWeight.setAttribute("class", "voteWeightColumn");
        innerDivVoteWeight.innerHTML = Number(delegateInfo[i].voteweight).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivProducedBlocks = document.createElement("label");
        innerDivProducedBlocks.setAttribute("class", "producedBlocksColumn");
        innerDivProducedBlocks.innerHTML = Number(delegateInfo[i].producedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivMissedBlocks = document.createElement("label");
        innerDivMissedBlocks.setAttribute("class", "missedBlocksColumn");
        innerDivMissedBlocks.innerHTML = Number(delegateInfo[i].missedblocks).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivApproval = document.createElement("label");
        innerDivApproval.setAttribute("class", "approvalColumn");
        innerDivApproval.innerHTML = Number(delegateInfo[i].approval).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivProductivity = document.createElement("label");
        innerDivProductivity.setAttribute("class", "productivityColumn");
        innerDivProductivity.innerHTML = Number(delegateInfo[i].productivity).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivForged = document.createElement("label");
        innerDivForged.setAttribute("class", "forgedColumn");
        innerDivForged.innerHTML = Number(delegateInfo[i].forged).toLocaleString(
            undefined,
            { minimumFractionDigits: 0 }
        );

        var innerDivGroups = document.createElement("label");
        innerDivGroups.setAttribute("class", "groupsColumn");
        innerDivGroups.innerHTML = getDelegateGroups(i);

        a1.appendChild(innerDivRank);
        a1.appendChild(innerDivName);
        a1.appendChild(innerDivVoteWeight);
        a1.appendChild(innerDivProducedBlocks);
        a1.appendChild(innerDivMissedBlocks);
        a1.appendChild(innerDivApproval);
        a1.appendChild(innerDivProductivity);
        a1.appendChild(innerDivForged);
        a1.appendChild(innerDivGroups);
        d1.appendChild(a1);

        parentDiv.appendChild(d1);

        var d2 = document.createElement("div");
        d2.setAttribute("class", "card-block collapse");
        d2.setAttribute("id", "collapse" + i);

        var p1 = document.createElement("p");

        var t = document.createTextNode("blah blah blah blah blah");
        p1.appendChild(t);

        d2.appendChild(p1);

        parentDiv.appendChild(d2);

        //delegateNum++;  
    }
}

function getDelegateGroups(i){
    if(delegateInfo[i].groups.length == 1)
    {
        return delegateInfo[i].groups[0];
    }
    else if(delegateInfo[i].groups.length > 1)
    {
        let groups = delegateInfo[i].groups[0];

        for(let ii = 1; ii < delegateInfo[i].groups.length; ii++)
        {
            groups += ', ' + delegateInfo[i].groups[ii];
        }

        return groups;
    }
    else
    {
        return '';
    }
}

function insertDelegateGroups(i){
    if(delegateGroups.elite.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("Elite");
    }
    if(delegateGroups.GDT.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("GDT");
    }
    if(delegateGroups.sherwood.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("Sherwood");
    }
    if(delegateGroups.LIG.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("LIG");
    }
    if(delegateGroups.liskbuilders.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("Lisk Builders");
    }
    if(delegateGroups.dutch.indexOf(delegateInfo[i].username) > -1)
    {
        delegateInfo[i].groups.push("Dutch");
    }
}

function lskforged(key, i){
    fetch('https://wallet.mylisk.com/api/delegates/forging/getForgedByAccount?generatorPublicKey=' + key)
    .then(res => res.json())
    .then((out) => {
        lskforgedHelper(out, i);
    }).catch(err => console.error(err));
}

function lskforgedHelper(forged, i){
    delegateInfo[i].forged = forged.forged / 100000000;
}