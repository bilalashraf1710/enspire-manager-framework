import React from 'react';

export function AppDropdown(props) {

    return (

        <ul role="menu" className="dropdown-menu" style={ { right: '16px' } }>

            { props.apps?.includes('dispatch') &&
                <li style={ { fontSize: 'larger', color: 'white', backgroundColor: '#8FBC8B' } }><a href={ '/dispatch/#/' + props.handle }><i className="fas fa-paper-plane" aria-hidden="true"></i> &nbsp; Dispatch</a></li>
            }

            { props.apps?.includes('procurement') &&
                <li style={ { fontSize: 'larger', color: 'white', backgroundColor: '#008000' } }><a href={ '/procurement/#/' + props.handle }><i className="fas fa-cubes" aria-hidden="true"></i> &nbsp; Procurement</a></li>
            }

            { props.apps?.includes('maintenance') &&
                <li style={ { fontSize: 'larger', color: 'white', backgroundColor: '#1ab394' } }><a href={ '/maintenance/#/' + props.handle }><i className="fas fa-tools" aria-hidden="true"></i> &nbsp; Maintenance</a></li>
            }

        </ul>
    );
}
