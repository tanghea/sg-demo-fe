function getTreeModel(params){
	if(params.keyType=='undefined'){
		params.keyType = 'name'; 
	}
	if(params.chkStyle=='undefined'){
		params.chkStyle = 'checkbox'; 
	}
	if(params.radioType=='undefined'){
		params.radioType =  'level'; 
	}
	if(params.callback=='undefined'){
		params.callback =  {}; 
	}
	var treeModel = {
		treeModelID: params.treeID,
		keyType: params.keyType,
		nodeList: [],
		zTree: '',
		setting: {
            view: {
                selectedMulti: false
            },
            check: {
                enable: true,
				chkStyle: params.chkStyle,
				radioType: params.radioType
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: params.callback
        },
		initTree: function(zNodes){
			$.fn.zTree.init($('#'+this.treeModelID), this.setting, zNodes);
			this.zTree = this.getTreeModel();
			this.expandAll();
		},
		getTreeModel: function(){
			return $.fn.zTree.getZTreeObj(this.treeModelID);
		},
		searchTreeNode: function(keyVal,zNodes) {
			zTree = this.getTreeModel();
			if (keyVal === '') {
				this.initTree(zNodes);
				// this.closeAll(zTree);  
				return;  
			}  
			this.nodeList = zTree.getNodesByParamFuzzy(this.keyType, keyVal); 
			if(this.nodeList.length==0){
				return ;
			}
			/**不查询父级 */ 
			for(var x = 0 ; x<this.nodeList.length ; x++){  
				if(this.nodeList[x].isParent){  
					this.nodeList.splice(x--,1);  
				}  
			}  
			/* */  
			//zTree.cancelSelectedNode();   
			this.nodeList = zTree.transformToArray(this.nodeList);  
			this.updateNodes(true,keyVal,zTree);
		},
		updateNodes: function(highlight,keyVal,zTree) {
            var allNode = zTree.transformToArray(zTree.getNodes());  
			zTree.hideNodes(allNode);
            for(var n in this.nodeList){  
                this.findParent(zTree,this.nodeList[n]);  
            }  
            zTree.showNodes(this.nodeList);  
            // this.closeAll(zTree);  
            this.nodeList = zTree.getNodesByParamFuzzy(this.keyType, keyVal);  
            for( var i=0; i<this.nodeList.length; i++) {   
                //zTree.updateNode(nodes[i]);  
                zTree.selectNode(this.nodeList[i],true);  
            }  
			// zTree.expandAll(true); //关闭所有节点  
        },
		findParent: function(zTree,node){  
            zTree.expandNode(node,true,false,false);  
            var pNode = node.getParentNode();  
            if(pNode != null){  
                this.nodeList.push(pNode);  
                this.findParent(zTree,pNode);  
            }  
        },
		closeAll: function(zTree){  
            zTree.expandAll(false); //关闭所有节点  
            var nodes = zTree.getNodes();  
            zTree.expandNode(nodes[0], true, false, true);  //打开根节点  
        },
        expandAll: function(){
        	this.zTree.expandAll(true); //展开所有节点
        },
		checkSelectedNodes: function(ids){
			var nodes = this.zTree.getNodes();
			for (var i=0, l=ids.length; i<l; i++) {
				this.checkNode(ids[i])
			}
			this.zTree.expandAll(true); //展开所有节点
		},
		reset: function(zNodes){
			this.initTree(zNodes);
		},
		checkNode: function(id){
			var node = this.zTree.getNodeByParam('id', id);
			this.zTree.checkNode(node, true, false, true);
		},
		setChkDisabled: function(ids){
			var node = null;
			for (var i=0, l=ids.length; i<l; i++) {
				node = this.zTree.getNodeByParam('id', ids[i]);
				this.zTree.setChkDisabled(node, true);
			}
		},
		getNodeByID: function(id){
			return this.zTree.getNodeByParam('id', id);
		},
		getSelectedNodes(){
			return this.zTree.getCheckedNodes(true);
		},
		getUnSelectedNodes(){
			return this.zTree.getCheckedNodes(false);
		},
		checkNode(node, checked, checkTypeFlag, callbackFlag) {
			this.zTree.checkNode(node, checked, checkTypeFlag, callbackFlag);
		}
	}
	return treeModel;
}