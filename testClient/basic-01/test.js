describe( "Given a Page with jQueryPlugin", function () {
  it( "should have an app", function () {
    Sitecore.Speak.app.should.exist;
  } );
  it( "should have a component called 'Checkbox'", function () {
    Sitecore.Speak.app.Checkbox.should.exist;
  } );
  it( "should have the IsChecked property set to True", function () {
    Sitecore.Speak.app.Checkbox.isChecked.should.be.true;
  } );
  it( "should have the a pluginOptions property set to True", function () {
    Sitecore.Speak.app.Checkbox.pluginOptions.should.exist;
  } );
  it( "should have the a pluginOptions property set to initial value created on the component", function () {
    Sitecore.Speak.app.Checkbox.pluginOptions.checkboxClass.should.equal( "icheckbox_minimal" );
  } );
  it( "should have a widget property", function () {
    Sitecore.Speak.app.Checkbox.widget.should.exist;
  } );
  it( "the HTML of the plugin should be there", function () {
    Sitecore.Speak.app.Checkbox.$el.parent().hasClass( "icheckbox_minimal" ).should.be.true;
    Sitecore.Speak.app.Checkbox.$el.parent().hasClass( "checked" ).should.be.true;
  } );
  describe( "when I want to check the componnet", function () {
    it( "should update the HTML", function () {
      Sitecore.Speak.app.Checkbox.isChecked = false;
      Sitecore.Speak.app.Checkbox.$el.parent().hasClass( "checked" ).should.be.false;
    } );
  } );
} );
