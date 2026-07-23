import React, { useReducer, useState } from 'react';

const initialState = {
    packageName: '',
    description: '',
    source: '',
    destination: '',
    touristsAllowed: '',
    personPerPackage: ''
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

const AddPackage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', state);

        try {
            const response = await fetch('http://localhost:8203/addpackage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state),
            });

            if (!response.ok) {
                throw new Error('Failed to add package');
            }

            const data = await response.json();
            console.log('Package added successfully:', data);
            setMsg('Package added successfully!');
            dispatch({ type: 'RESET' });
        } catch (error) {
            console.error('Error:', error);
            setMsg('Failed to add package. Please try again later.');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-4">
                <h2 className="text-center mb-4">Add New Package</h2>
                {msg && <div className={alert `${msg.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">{msg}</div>}
                <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
                    <div className="mb-3">
                        <label htmlFor="packageName" className="form-label">Package Name</label>
                        <input
                            type="text"
                            id="packageName"
                            className="form-control"
                            value={state.packageName}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'packageName', value: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={state.description}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="source" className="form-label">Source</label>
                        <input
                            type="text"
                            id="source"
                            className="form-control"
                            value={state.source}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'source', value: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="destination" className="form-label">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            className="form-control"
                            value={state.destination}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'destination', value: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="touristsAllowed" className="form-label">Tourists Allowed</label>
                        <input
                            type="number"
                            id="touristsAllowed"
                            className="form-control"
                            value={state.touristsAllowed}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'touristsAllowed', value: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="personPerPackage" className="form-label">Person Per Package</label>
                        <input
                            type="number"
                            id="personPerPackage"
                            className="form-control"
                            value={state.personPerPackage}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'personPerPackage', value: e.target.value })}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-warning flex-fill me-2">Add Package</button>
                        <button
                            type="button"
                            className="btn btn-warning flex-fill"
                            onClick={() => dispatch({ type: 'RESET' })}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackage;