// TODO
//
// Kefir.constant(x)
// Kefir.fromArray(values)



// Never

var neverObj = new Stream();
neverObj.__sendEnd();
neverObj.__objName = 'Kefir.never()'
Kefir.never = function() {
  return neverObj;
}




// Once
// TODO: fix onError ???

Kefir.OnceStream = function OnceStream(value){
  Stream.call(this);
  this.__value = value;
}

inherit(Kefir.OnceStream, Stream, {

  __ClassName: 'OnceStream',
  onValue: function(){
    if (!this.isEnded()) {
      callFn(arguments, [this.__value]);
      this.__value = null;
      this.__sendEnd();
    }
    return this;
  }

})

Kefir.once = function(x) {
  return new Kefir.OnceStream(x);
}





// fromBinder
// TODO: is all ok with errors?

Kefir.FromBinderStream = function FromBinderStream(subscribe){
  Stream.call(this);
  this.__subscribe = subscribe;
}

inherit(Kefir.FromBinderStream, Stream, {

  __ClassName: 'FromBinderStream',
  __onFirstIn: function(){
    var _this = this;
    this.__usubscriber = this.__subscribe(function(x){
      _this.__sendAny(x);
    });
  },
  __onLastOut: function(){
    if (isFn(this.__usubscriber)) {
      this.__usubscriber();
    }
    this.__usubscriber = null;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__subscribe = null;
  }

})

Kefir.fromBinder = function(subscribe){
  return new Kefir.FromBinderStream(subscribe);
}