import axios from "axios";

export default function() {

function fetchTasks(){

    return function(dispatch){
        axios.get("api/v1/loadtasks")
            .then((response) => {
                var toDo = 0;
                var inProgress = 0;
                var complete = 0;
                response.data.map((tasksEntered) => {
                    if(tasksEntered.taskstatus === "toDo"){
                        toDo = toDo + 1;
                    }
                    else if(tasksEntered.taskstatus === "inProgress"){
                        inProgress = inProgress + 1;
                    }
                    else if(tasksEntered.taskstatus === "complete"){
                        complete = complete + 1;
                    }
                })
                dispatch({
                    type: "TASKS_RECEIVED",
                    payload: response.data,
                    toDoPayload: toDo,
                    inProgressPayLoad: inProgress,
                    completePayload: complete
                })
            })
            .catch((err) => {
                dispatch({type: "FETCHING_FAILED", payload: err})
            })
    }
}

function addCounter(taskType, sourceType){
    return function(dispatch) {
        if(taskType === "toDo"){
            dispatch({type: "ADD_TODO_COUNTER", payload: 1})
        }
        else if(taskType === "inProgress"){
            dispatch({type: "ADD_INPROGRESS_COUNTER", payload: 1})
        }
        else if(taskType === "complete"){
            dispatch({type: "ADD_COMPLETE_COUNTER", payload: 1})
        }    

        if(sourceType === "toDo"){
            dispatch({type: "DEC_TODO_COUNTER", payload: 1})
        }
        else if(sourceType === "inProgress"){
            dispatch({type: "DEC_INPROGRESS_COUNTER", payload: 1})
        }
        else if(sourceType === "complete"){
            dispatch({type: "DEC_COMPLETE_COUNTER", payload: 1})
        }               
    }
}

}