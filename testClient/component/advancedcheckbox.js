Sitecore.Speak.component( {
  name: "advancedcheckbox",
  control: "iCheck",
  options: [ {
    name: "checkboxClass",
    defaultValue: "icheckbox_minimal"
  }, {
    name: "radioClass",
    defaultValue: "iradio_minimal"
  }, {
    name: "increaseArea",
    defaultValue: "20%"
  } ],
  events: [ {
    name: "ifChanged",
    on: "test"
  } ],
  initialized: function () {
    this.update();
  },
  test: function () {
    console.log( "!!!test!!!" );
  },
  update: function () {
    if ( this.isChecked ) {
      this.$el.iCheck( 'check' );
    } else {
      this.$el.iCheck( 'uncheck' );
    }
  }
} );
