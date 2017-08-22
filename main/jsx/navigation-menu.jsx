

class NavigationMenu extends React.Component {
    renderMenuItem(name, url) {
        return (
        <MenuItem name={name} url={url}/>
        );
    }

  render() {
      return (<div className="navigation-menu flex-row">
        <img className="menu-logo" src="../static/main/img/logo_test_Go.png"/>
        {this.renderMenuItem("Home", "#")}
        {this.renderMenuItem("Core Datasets", "#")}
        {this.renderMenuItem("About", "#")}
        {this.renderMenuItem("IFRC.org", "#")}
        {this.renderMenuItem("DMIS", "#")}
      </div>);
  }
};


class MenuItem extends React.Component {

    render() {
        console.log(this.props);
        return (<div className="menu-item" href={this.props.url}>{this.props.name}</div>);
    }
};


ReactDOM.render(
  <NavigationMenu />,
  document.getElementById('app')
);


