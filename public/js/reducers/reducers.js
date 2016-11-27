export default function() {

//initial state for tasks dataset
var tasksInitialState = {
    tasks: [],
    toDoLength: 0,
    inProgressLength: 0,
    completeLength: 0
}

const tasksReducer = (state=tasksInitialState, action) => {
    if (action.type === "ADD") {
        return {...state, tasks: [...state.tasks, action.newTask]}
    }
    if (action.type === "ADD_TODO_COUNTER") {
        return {...state, toDoLength: state.toDoLength + action.payload}
    }
    if (action.type === "ADD_INPROGRESS_COUNTER") {
        return {...state, inProgressLength: state.inProgressLength + action.payload}
    }
    if (action.type === "ADD_COMPLETE_COUNTER") {
        return {...state, completeLength: state.completeLength + action.payload}
    }
    if (action.type === "DEC_TODO_COUNTER") {
        return {...state, toDoLength: state.toDoLength - action.payload}
    }
    if (action.type === "DEC_INPROGRESS_COUNTER") {
        return {...state, inProgressLength: state.inProgressLength - action.payload}
    }
    if (action.type === "DEC_COMPLETE_COUNTER") {
        return {...state, completeLength: state.completeLength - action.payload}
    }
    if (action.type === "TASKS_RECEIVED") {
        return {
            ...state, 
            tasks: action.payload, 
            toDoLength: action.toDoPayload,
            inProgressLength: action.inProgressPayLoad,
            completeLength: action.completePayload
        }
    }
    if (action.type === "FETCHING_FAILED") {
        return {...state, tasks: action.payload}
    }
    return state;
}

//will be used for header/navigation status
const headerReducer = (state={}, action) => {
    return state;
}

//allows us have one store while calling on one reducer dependent on the data set being augmented
const reducers = combineReducers({
    tasks: tasksReducer,
    header: headerReducer
})

}