/**
 * Title: Autocomplete.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the autocomplete engine for finding valid database keys
 */
class Autocomplete {
    constructor(binary) {
        this.insert = this.insert.bind(this)
        this.chainBuild = this.chainBuild.bind(this);
        this.getNode = this.getNode.bind(this);
        this.search = this.search.bind(this);
        this.dfs = this.dfs.bind(this);

        this.loadTree = this.loadTree.bind(this);
        // this.getCompletions = this.getCompletions.bind(this);

        // this.loadBinary = this.loadBinary.bind(this);
        this.loadJSON = this.loadJSON.bind(this);
        this.loadList = this.loadList.bind(this);

        // this.baseStream = new Promise.reject('Tree not loaded');
    }

    loadJSON(json){
        return this.loadTree(json)
    }

    loadList(list){
        this.root = this.getNode('m');
        list.forEach((str)=>this.insert(this.root,str,0))
        return this
    }

    loadTree(unzipped){
        this.root = JSON.parse(unzipped)
        return this
    }

    // getCompletions(base,callback){
    //     // return this.baseStream
    //     return this.baseStream.then((auto)=>callback(auto.getCompletion(base)))
    // }

    getCompletion(base){
        return this.search(this.root,base,0)
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

    search(node,str,idx){
        if(idx === str.length){//find some completions
            return this.dfs(node,str.split(''))
        }
        let curr = str.charAt(idx);
        if(curr > node.v){ //search to the right of this node
            if(node.r){
                return this.search(node.r,str,idx)
            } else { //no node to the right, didnt find anything
                return []
            }
        } else if(curr < node.v){ //search to the left of this node
            if(node.l){
                return this.search(node.l,str,idx)
            } else { //no node to the right, didnt find anything
                return []
            }
        } else {
            if(node.c){
                return this.search(node.c,str,idx+1).concat(idx+1===str.length&&node.e!==undefined?[str]:[]);
            } else {
                if(idx+1===str.length){
                    return [str]
                }
                return []
            }
        }        
    }

    dfs(node,base){
        var result = []
        if(node.r){
            result = result.concat(this.dfs(node.r,base))
        }
        if(node.l){
            result = result.concat(this.dfs(node.l,base))
        }
        base.push(node.v)
        if(node.e!==undefined){
            result = result.concat(base.join(''))
        }
        if(node.c){
            // console.log(JSON.stringify(base))
            result = result.concat(this.dfs(node.c, base))
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
        str.substring(idx+1).split('').reduce((prev,next)=>{return prev.c=this.getNode(next)},buildRoot).e = '';
        return buildRoot
    }
}


export default Autocomplete;