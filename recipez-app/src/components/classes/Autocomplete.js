/**
 * Title: Autocomplete.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the autocomplete engine for finding valid database keys
 */

class Autocomplete{
    constructor(dictionary){
        this.insert = this.insert.bind(this)
        this.chainBuild = this.chainBuild.bind(this);
        this.getNode = this.getNode.bind(this);
        this.search = this.search.bind(this);
        this.dfs = this.dfs.bind(this);

        this.root = this.getNode('m');
        dictionary.forEach((word)=>this.insert(this.root,word,0));

    }

    getCompletion(base){
        return this.search(this.root,base,0)
    }

    getNode(value,left,center,right){
        return {value:value,left:left,center:center,right:right}
    }

    insert(node,str,idx){
        if(idx >= str.length){
            return
        }
        let curr = str.charAt(idx);
        if(curr > node.value){
            if(node.right){
                this.insert(node.right,str,idx)
            } else { //no node to the right, create one
                node.right = this.chainBuild(str,idx)
            }
        } else if(curr < node.value){ //no node to the left, create one
            if(node.left){
                this.insert(node.left,str,idx)
            } else { //no node to the right, create one
                node.left = this.chainBuild(str,idx)
            }
        } else {
            if(node.center){
                this.insert(node.center,str,idx+1)
            } else {
                node.center = this.chainBuild(str,idx+1)
            }
        }
        return node
    }

    search(node,str,idx){
        if(idx >= str.length){//find some completions
            return this.dfs(node,str.split(''))
        }
        let curr = str.charAt(idx);
        if(curr > node.value){ //search to the right of this node
            if(node.right){
                return this.search(node.right,str,idx)
            } else { //no node to the right, didnt find anything
                return []
            }
        } else if(curr < node.value){ //search to the left of this node
            if(node.left){
                return this.search(node.left,str,idx)
            } else { //no node to the right, didnt find anything
                return []
            }
        } else {
            if(node.center){
                return this.search(node.center,str,idx+1)
            } else {
                return []
            }
        }        
    }

    dfs(node,base){
        var result = []
        if(node.right){
            result = result.concat(this.dfs(node.right,base))
        }
        if(node.left){
            result = result.concat(this.dfs(node.left,base))
        }
        base.push(node.value)
        if(node.center){
            // console.log(JSON.stringify(base))
            result = result.concat(this.dfs(node.center,base))
        } else {
            // console.log(base.join(''))
            result = result.concat(base.join(''))
        }
        base.pop()
        return result
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
        str.substring(idx+1).split('').reduce((prev,next)=>{return prev.center=this.getNode(next)},buildRoot)
        return buildRoot
    }
}

fs = require('fs');
fs.readFile('../../scripts/ingredient.csv','utf8',(err,data)=>{
    if(err){
        console.log(err)
        return
    }
    // console.log(JSON.stringify(data))
    // var auto = new Autocomplete(['cat','cast','category','cart','cats'])
    var auto = new Autocomplete(data.split(','))
    // console.log(JSON.stringify(auto))
    console.log(auto.getCompletion('ca'))
})