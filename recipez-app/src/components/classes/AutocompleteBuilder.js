class Autocomplete{
    constructor(dictionary){
        this.insert = this.insert.bind(this)
        this.chainBuild = this.chainBuild.bind(this);
        this.getNode = this.getNode.bind(this);

        this.root = this.getNode('m');

        dictionary.forEach((word)=>this.insert(this.root,word,0))
    }

    getNode(value,left,center,right){
        return {v:value,l:left,c:center,r:right}
    }

    insert(node,str,idx){
        if(idx >= str.length){
            return
        }
        let curr = str.charAt(idx);
        if(curr > node.v){
            if(node.r){
                this.insert(node.r,str,idx)
            } else { //no node to the right, create one
                node.r = this.chainBuild(str,idx)
            }
        } else if(curr < node.v){ //no node to the left, create one
            if(node.l){
                this.insert(node.l,str,idx)
            } else { //no node to the right, create one
                node.l = this.chainBuild(str,idx)
            }
        } else {
            if(node.c){
                if(idx===str.length-1){
                    node.e = '';
                    return
                }
                this.insert(node.c,str,idx+1)
            } else {
                node.c = this.chainBuild(str,idx+1)
            }
        }
        return node
    }

    /**
     * build a chain of nodes starting at the given index of a string
     * @param  {[type]} str [description]
     * @param  {[type]} idx [description]
     * @return {[type]}     [description]
     */
    chainBuild(str,idx){
        // alert(str.substring(idx+1).split('').reduce((prev,next)=>{return prev.center=this.getNode(next)},this.getNode(str.charAt(idx))))
        var buildRoot = this.getNode(str.charAt(idx))
        str.substring(idx+1).split('').reduce((prev,next)=>{return prev.c=this.getNode(next)},buildRoot).e = '';
        return buildRoot
    }
}

/**
 * AUTOCOMPLETE BUILDER -- run this in node to compile trees into JSON offline, then zip them and push to database with scanner.py in scripts
 */
fs = require('fs');
if(process.argv.length < 3){
    //what do
    console.error('No table name given')
    return;
}
var tableName = process.argv[2]

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

csvPath = './'+tableName+'.csv';
jsonPath = tableName+'.tst'
fs.readFile(csvPath,'utf8',(err,data)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('read csv successfully --> building tree')
    // console.log(JSON.stringify(data))
    // var auto = new Autocomplete(['cat','cast','category','cart','cats'])
    var auto = new Autocomplete(shuffle(data.split('\n')))
    // var auto = new Autocomplete(null,data)
    // console.log(JSON.stringify(auto))
    // console.log(auto.getCompletion('ca'))
    fs.writeFile(tableName+'.tst',JSON.stringify(auto.root),(err)=>{
        if(err){
            console.log(err)
            return
        }
        console.log('saved successfully!')
    })
})