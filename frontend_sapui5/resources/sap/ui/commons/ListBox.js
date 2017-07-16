/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','jquery.sap.strings'],function(q,a,C,I){"use strict";var L=C.extend("sap.ui.commons.ListBox",{metadata:{library:"sap.ui.commons",properties:{editable:{type:"boolean",group:"Behavior",defaultValue:true},enabled:{type:"boolean",group:"Behavior",defaultValue:true},allowMultiSelect:{type:"boolean",group:"Behavior",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},scrollTop:{type:"int",group:"Behavior",defaultValue:-1},displayIcons:{type:"boolean",group:"Behavior",defaultValue:false},displaySecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},valueTextAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},secondaryValueTextAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},visibleItems:{type:"int",group:"Dimension",defaultValue:null}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{parameters:{id:{type:"string"},selectedIndex:{type:"int"},selectedItem:{type:"sap.ui.core.Item"},selectedIndices:{type:"int[]"}}}}}});L.prototype.init=function(){this.allowTextSelection(false);if(!this._bHeightInItems){this._bHeightInItems=false;this._iVisibleItems=-1;}this._sTotalHeight=null;if(L._fItemHeight===undefined){L._fItemHeight=-1;}if(L._iBordersAndStuff===undefined){L._iBordersAndStuff=-1;}this._aSelectionMap=[];this._iLastDirectlySelectedIndex=-1;this._aActiveItems=null;};L.prototype.onThemeChanged=function(){this._sTotalHeight=null;if(!this._bHeightInItems){this._iVisibleItems=-1;}this._skipStoreScrollTop=true;if(this.getDomRef()){this.invalidate();}};L.prototype.onBeforeRendering=function(){if(this._skipStoreScrollTop){delete this._skipStoreScrollTop;return;}this.getScrollTop();};L.prototype.onAfterRendering=function(){var d=this.getDomRef();if(L._fItemHeight<=0){var s=sap.ui.getCore().getStaticAreaRef();var b=document.createElement("div");b.id="sap-ui-commons-ListBox-sizeDummy";b.innerHTML='<div class="sapUiLbx sapUiLbxFlexWidth sapUiLbxStd"><ul><li class="sapUiLbxI"><span class="sapUiLbxITxt">&nbsp;</span></li></ul></div>';if(sap.ui.Device.browser.safari){s.insertBefore(b,s.firstChild);}else{s.appendChild(b);}var o=b.firstChild.firstChild.firstChild;L._fItemHeight=o.offsetHeight;if(!!sap.ui.Device.browser.internet_explorer&&(document.documentMode==9||document.documentMode==10)){var c=document.defaultView.getComputedStyle(o.firstChild,"");var h=parseFloat(c.getPropertyValue("height").split("px")[0]);if(!(typeof h==="number")||!(h>0)){h=q(o.firstChild).height();}var p=parseFloat(c.getPropertyValue("padding-top").split("px")[0]);var e=parseFloat(c.getPropertyValue("padding-bottom").split("px")[0]);var f=parseFloat(c.getPropertyValue("border-top-width").split("px")[0]);var g=parseFloat(c.getPropertyValue("border-bottom-width").split("px")[0]);L._fItemHeight=h+p+e+f+g;}s.removeChild(b);}if(L._iBordersAndStuff==-1){var D=q(this.getDomRef());var j=D.outerHeight();var k=D.height();L._iBordersAndStuff=j-k;}if(this._bHeightInItems){if(this._sTotalHeight==null){this._calcTotalHeight();d.style.height=this._sTotalHeight;}}if(this._iVisibleItems==-1){this._updatePageSize();}var F=this.getFocusDomRef(),r=F.childNodes,l=[],m=this.getItems();this._aActiveItems=[];var A=this._aActiveItems;for(var i=0;i<r.length;i++){if(!(m[i]instanceof sap.ui.core.SeparatorItem)){A[l.length]=i;l.push(r[i]);}}if(!this.oItemNavigation){var n=(!this.getEnabled()||!this.getEditable());this.oItemNavigation=new I(null,null,n);this.oItemNavigation.attachEvent(I.Events.AfterFocus,this._handleAfterFocus,this);this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(F);this.oItemNavigation.setItemDomRefs(l);this.oItemNavigation.setCycling(false);this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(this.getSelectedIndex()));this.oItemNavigation.setPageSize(this._iVisibleItems);if(this.oScrollToIndexRequest){this.scrollToIndex(this.oScrollToIndexRequest.iIndex,this.oScrollToIndexRequest.bLazy);}else{var t=this.getProperty("scrollTop");if(t>-1){d.scrollTop=t;}}var u=this;window.setTimeout(function(){if(u.oScrollToIndexRequest){u.scrollToIndex(u.oScrollToIndexRequest.iIndex,u.oScrollToIndexRequest.bLazy);u.oScrollToIndexRequest=null;}else{var t=u.getProperty("scrollTop");if(t>-1){d.scrollTop=t;}}},0);};L.prototype._getNavigationIndexForRealIndex=function(b){var c=this.getItems();var n=b;for(var i=0;i<b;i++){if(c[i]instanceof sap.ui.core.SeparatorItem){n--;}}return n;};L.prototype._updatePageSize=function(){var d=this.getDomRef();if(d){if(L._fItemHeight>0){this._iVisibleItems=Math.floor(d.clientHeight/L._fItemHeight);}}};L.prototype.scrollToIndex=function(i,l){var d=this.getDomRef();if(d){var o=this.$("list").children("li[data-sap-ui-lbx-index="+i+"]");o=o.get(0);if(o){var s=o.offsetTop;if(!l){this.setScrollTop(s);}else{var c=d.scrollTop;var v=q(d).height();if(c>=s){this.setScrollTop(s);}else if((s+L._fItemHeight)>(c+v)){this.setScrollTop(Math.ceil(s+L._fItemHeight-v));}}}this.getScrollTop();}else{this.oScrollToIndexRequest={iIndex:i,bLazy:l};}return this;};L.prototype.getVisibleItems=function(){return this._iVisibleItems;};L.prototype.setVisibleItems=function(i){this.setProperty("visibleItems",i,true);this._iVisibleItems=i;if(i<0){this._bHeightInItems=false;}else{this._bHeightInItems=true;}this._sTotalHeight=null;var d=this.getDomRef();if(d){if(this._bHeightInItems){var f=d.firstChild?d.firstChild.firstChild:null;if(f||((L._fItemHeight>0)&&(L._iBordersAndStuff>0))){d.style.height=this._calcTotalHeight();}else{this.invalidate();}}else{d.style.height=this.getHeight();this._updatePageSize();if(this.oItemNavigation){this.oItemNavigation.setPageSize(this._iVisibleItems);}}}return this;};L.prototype._calcTotalHeight=function(){var d=this._iVisibleItems*L._fItemHeight;this._sTotalHeight=(d+L._iBordersAndStuff)+"px";return this._sTotalHeight;};L.prototype.setHeight=function(h){this.validateProperty("height",h);if(this.getHeight()===h){return this;}this._bHeightInItems=false;this._iVisibleItems=-1;var d=this.getDomRef();if(d){d.style.height=h;this._updatePageSize();if(this.oItemNavigation){this.oItemNavigation.setPageSize(this._iVisibleItems);}}return this.setProperty("height",h,true);};L.prototype.setWidth=function(w){var d=this.getDomRef();if(d){d.style.width=w;}this.setProperty("width",w,true);return this;};L.prototype.setScrollTop=function(s){s=Math.round(s);var b=this.getDomRef();this.oScrollToIndexRequest=null;if(b){b.scrollTop=s;}this.setProperty("scrollTop",s,true);return this;};L.prototype.getScrollTop=function(){var s=this.getDomRef();if(s){var b=Math.round(s.scrollTop);this.setProperty("scrollTop",b,true);return b;}else{return this.getProperty("scrollTop");}};L.prototype.onmousedown=function(e){if(!!sap.ui.Device.browser.webkit&&e.target&&e.target.id===this.getId()){var i=document.activeElement?document.activeElement.id:this.getId();var t=this;window.setTimeout(function(){var s=t.getDomRef().scrollTop;q.sap.focus(q.sap.domById(i));t.getDomRef().scrollTop=s;},0);}};L.prototype.onclick=function(e){this._handleUserActivation(e);};L.prototype.ontouchmove=function(e){e.setMarked();};L.prototype.onsapspace=function(e){this._handleUserActivation(e);};L.prototype.onsapspacemodifiers=L.prototype.onsapspace;L.prototype.onsapenter=L.prototype.onsapspace;L.prototype.onsapentermodifiers=L.prototype.onsapspace;L.prototype._handleUserActivation=function(e){if(!this.getEnabled()||!this.getEditable()){return;}var s=e.target;if(s.id===""||q.sap.endsWith(s.id,"-txt")){s=s.parentNode;if(s.id===""){s=s.parentNode;}}var b=q(s).attr("data-sap-ui-lbx-index");if(typeof b=="string"&&b.length>0){var i=parseInt(b,10);var c=this.getItems();var o=c[i];if(c.length<=i){i=c.length-1;}if(i>=0&&i<c.length){if(o.getEnabled()&&!(o instanceof sap.ui.core.SeparatorItem)){if(e.ctrlKey||e.metaKey){this._handleUserActivationCtrl(i,o);}else if(e.shiftKey){this.setSelectedIndices(this._getUserSelectionRange(i));this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});this._iLastDirectlySelectedIndex=i;}else{this._handleUserActivationPlain(i,o);}}}e.preventDefault();e.stopPropagation();}};L.prototype._handleUserActivationPlain=function(i,o){this._iLastDirectlySelectedIndex=i;this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(i));if(this.getSelectedIndex()!=i||this.getSelectedIndices().length>1){this.setSelectedIndex(i);this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});}};L.prototype._handleUserActivationCtrl=function(i,o){this._iLastDirectlySelectedIndex=i;this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(i));if(this.isIndexSelected(i)){this.removeSelectedIndex(i);}else{this.addSelectedIndex(i);}this.fireSelect({id:this.getId(),selectedIndex:i,selectedIndices:this.getSelectedIndices(),selectedItem:o,sId:this.getId(),aSelectedIndices:this.getSelectedIndices()});};L.prototype._getUserSelectionRange=function(b){if(this._iLastDirectlySelectedIndex==-1){return[];}var c=this.getItems();var r=[];var i;if(this._iLastDirectlySelectedIndex<=b){for(i=this._iLastDirectlySelectedIndex;i<=b;i++){if((i>-1)&&(c[i].getEnabled()&&!(c[i]instanceof sap.ui.core.SeparatorItem))){r.push(i);}}}else{for(i=b;i<=this._iLastDirectlySelectedIndex;i++){if((i>-1)&&(c[i].getEnabled()&&!(c[i]instanceof sap.ui.core.SeparatorItem))){r.push(i);}}}return r;};L.prototype.getSelectedIndex=function(){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){return i;}}return-1;};L.prototype.setSelectedIndex=function(s){if((s<-1)||(s>this._aSelectionMap.length-1)){return this;}var b=this.getItems();if((s>-1)&&(!b[s].getEnabled()||(b[s]instanceof sap.ui.core.SeparatorItem))){return this;}for(var i=0;i<this._aSelectionMap.length;i++){this._aSelectionMap[i]=false;}this._aSelectionMap[s]=true;if(this.oItemNavigation){this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(s));}this.getRenderer().handleSelectionChanged(this);return this;};L.prototype.addSelectedIndex=function(s){if(!this.getAllowMultiSelect()){this.setSelectedIndex(s);}if((s<-1)||(s>this._aSelectionMap.length-1)){return this;}var i=this.getItems();if((s>-1)&&(!i[s].getEnabled()||(i[s]instanceof sap.ui.core.SeparatorItem))){return this;}if(this._aSelectionMap[s]){return this;}this._aSelectionMap[s]=true;this.getRenderer().handleSelectionChanged(this);return this;};L.prototype.removeSelectedIndex=function(i){if((i<0)||(i>this._aSelectionMap.length-1)){return this;}if(!this._aSelectionMap[i]){return this;}this._aSelectionMap[i]=false;this.getRenderer().handleSelectionChanged(this);return this;};L.prototype.clearSelection=function(){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){this._aSelectionMap[i]=false;}}this._iLastDirectlySelectedIndex=-1;if(this.oItemNavigation){this.oItemNavigation.setSelectedIndex(-1);}this.getRenderer().handleSelectionChanged(this);return this;};L.prototype.getSelectedIndices=function(){var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(i);}}return r;};L.prototype.setSelectedIndices=function(s){var b=[];var c=this.getItems();var i;for(i=0;i<s.length;i++){if((s[i]>-1)&&(s[i]<this._aSelectionMap.length)){if(c[s[i]].getEnabled()&&!(c[s[i]]instanceof sap.ui.core.SeparatorItem)){b.push(s[i]);}}}if(b.length>0){if(!this.getAllowMultiSelect()){b=[b[0]];}}for(i=0;i<this._aSelectionMap.length;i++){this._aSelectionMap[i]=false;}for(i=0;i<b.length;i++){this._aSelectionMap[b[i]]=true;}this.getRenderer().handleSelectionChanged(this);return this;};L.prototype.addSelectedIndices=function(s){var b=[];var c=this.getItems();var i;for(i=0;i<s.length;i++){if((s[i]>-1)&&(s[i]<this._aSelectionMap.length)){if(c[s[i]].getEnabled()&&!(c[s[i]]instanceof sap.ui.core.SeparatorItem)){b.push(s[i]);}}}if(b.length>0){if(!this.getAllowMultiSelect()){b=[b[0]];}for(i=0;i<b.length;i++){this._aSelectionMap[b[i]]=true;}this.getRenderer().handleSelectionChanged(this);}return this;};L.prototype.isIndexSelected=function(i){if((i<-1)||(i>this._aSelectionMap.length-1)){return false;}return this._aSelectionMap[i];};L.prototype.setSelectedKeys=function(s){var b=this.getItems();var k={};for(var i=0;i<s.length;i++){k[s[i]]=true;}var c=[];for(var j=0;j<b.length;j++){if(k[b[j].getKey()]){c.push(j);}}return this.setSelectedIndices(c);};L.prototype.getSelectedKeys=function(){var b=this.getItems();var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(b[i].getKey());}}return r;};L.prototype.getSelectedItem=function(){var i=this.getSelectedIndex();if((i<0)||(i>=this._aSelectionMap.length)){return null;}return this.getItems()[i];};L.prototype.getSelectedItems=function(){var b=this.getItems();var r=[];for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){r.push(b[i]);}}return r;};L.prototype.setAllowMultiSelect=function(A){this.setProperty("allowMultiSelect",A);var o=false;var t=false;if(!A&&this._aSelectionMap){for(var i=0;i<this._aSelectionMap.length;i++){if(this._aSelectionMap[i]){if(!o){o=true;}else{this._aSelectionMap[i]=false;t=true;}}}}if(t){this.getRenderer().handleSelectionChanged(this);}return this;};L.prototype._handleAfterFocus=function(c){var i=c.getParameter("index");i=((i!==undefined&&i>=0)?this._aActiveItems[i]:0);this.getRenderer().handleARIAActivedescendant(this,i);};L.prototype.setItems=function(b,d,n){this._bNoItemsChangeEvent=true;if(d){this.destroyItems();}else{this.removeAllItems();}for(var i=0,l=b.length;i<l;i++){this.addItem(b[i]);}this._bNoItemsChangeEvent=undefined;if(!n){this.fireEvent("itemsChanged",{event:"setItems",items:b});}return this;};L.prototype.addItem=function(i){this._bNoItemInvalidateEvent=true;this.addAggregation("items",i);this._bNoItemInvalidateEvent=false;if(!this._aSelectionMap){this._aSelectionMap=[];}this._aSelectionMap.push(false);if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"addItem",item:i});}i.attachEvent("_change",this._handleItemChanged,this);return this;};L.prototype.insertItem=function(i,b){if((b<0)||(b>this._aSelectionMap.length)){return this;}this._bNoItemInvalidateEvent=true;this.insertAggregation("items",i,b);this._bNoItemInvalidateEvent=false;this._aSelectionMap.splice(b,0,false);this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"insertItems",item:i,index:b});}i.attachEvent("_change",this._handleItemChanged,this);return this;};L.prototype.removeItem=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfItem(e);}if((i<0)||(i>this._aSelectionMap.length-1)){if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeItem",item:e});}return undefined;}this._bNoItemInvalidateEvent=true;var r=this.removeAggregation("items",i);this._bNoItemInvalidateEvent=false;this._aSelectionMap.splice(i,1);this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeItem",item:r});}r.detachEvent("_change",this._handleItemChanged,this);return r;};L.prototype.removeAllItems=function(){this._bNoItemInvalidateEvent=true;var r=this.removeAllAggregation("items");this._bNoItemInvalidateEvent=false;this._aSelectionMap=[];this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"removeAllItems"});}for(var i=0;i<r.length;i++){r[i].detachEvent("_change",this._handleItemChanged,this);}return r;};L.prototype.destroyItems=function(){var b=this.getItems();for(var i=0;i<b.length;i++){b[i].detachEvent("_change",this._handleItemChanged,this);}this._bNoItemInvalidateEvent=true;var d=this.destroyAggregation("items");this._bNoItemInvalidateEvent=false;this._aSelectionMap=[];this.invalidate();if(!this._bNoItemsChangeEvent){this.fireEvent("itemsChanged",{event:"destroyItems"});}return d;};L.prototype.updateItems=function(){this._bNoItemsChangeEvent=true;this.updateAggregation("items");this._bNoItemInvalidateEvent=true;if(!this._bItemsChangedAfterUpdate){this._bItemsChangedAfterUpdate=q.sap.delayedCall(0,this,"_itemsChangedAfterUpdate");}};L.prototype._itemsChangedAfterUpdate=function(){this._bNoItemsChangeEvent=undefined;this._bItemsChangedAfterUpdate=undefined;this._bNoItemInvalidateEvent=undefined;this.fireEvent("itemsChanged",{event:"updateItems"});};L.prototype.exit=function(){if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}if(this._bItemsChangedAfterUpdate){q.sap.clearDelayedCall(this._bItemsChangedAfterUpdate);this._bItemsChangedAfterUpdate=undefined;this._bNoItemsChangeEvent=undefined;this._bNoItemInvalidateEvent=undefined;}};L.prototype.getFocusDomRef=function(){return this.getDomRef("list");};L.prototype.getIdForLabel=function(){return this.getId()+'-list';};L.prototype._handleItemChanged=function(e){if(!this._bNoItemInvalidateEvent){this.fireEvent("itemInvalidated",{item:e.oSource});}};return L;},true);