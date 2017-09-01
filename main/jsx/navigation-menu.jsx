import React from 'react';
import ReactDOM from 'react-dom';

class NavigationMenu extends React.Component {

    renderMenuItem(name, url) {
        return (
        <MenuItem name={name} url={url} />
        );
    }

        render() {
        return (
      <div className="nav-menu">
        <div className="flex-row">
            <img className="nav-icon" alt="IFRC GO logo" src="../static/main/img/logo_test_Go.png" />
        </div>
        <div className="wrapper flex-row">
        <div className="nav-link-container">
            {this.renderMenuItem("Home", "#")}
            {this.renderMenuItem("Core Datasets", "#")}
            {this.renderMenuItem("About", "#")}
            {this.renderMenuItem("IFRC.org", "#")}
            {this.renderMenuItem("DMIS", "#")}
            {this.renderMenuItem("hakjhakhf", "#")}
        </div>
        </div>
      </div>);
    }
}


class MenuItem extends React.Component {

    render() {
        console.log(this.props);
        return (<div className="nav-item" href={this.props.url}>{this.props.name}</div>);
    }
}



ReactDOM.render(
  <NavigationMenu />,
  document.getElementById('app')
);


