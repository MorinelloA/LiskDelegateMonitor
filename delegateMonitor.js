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
            populateInactiveDelegateTables();
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

        var cell2 = row.insertCell(1);
        cell2.innerHTML = delegateInfo[i].username;

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

    for(var i=0; i<101; i++)
    {
        let row = delegateTable.insertRow(i + 1);

        var cell1 = row.insertCell(0);
        cell1.innerHTML = (i + 1);

        var cell2 = row.insertCell(1);
        cell2.innerHTML = delegateInfo[i].username;

        var cell3 = row.insertCell(2);
        //cell3.innerHTML = delegateInfo[i].voteweight;

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