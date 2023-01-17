import {useState} from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

function WorkoutForm() {
  const { dispatch } = useWorkoutsContext();
  const {user} = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user) {
      return setError("You must be logged in");
    }

    const workout = {title,load,reps};

    const response = await fetch(`/api/workouts`, {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    const data = await response.json();

    if(!response.ok) {
      setError(data.error);
      setEmptyFields(data.emptyFields);
    } else {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setEmptyFields([]);
      console.log('new workout added', data);
      dispatch({type: 'CREATE_WORKOUT', payload: data});
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new workout</h3>

      <label>Exercise Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={emptyFields.includes('title') ? 'error' : null}/>

      <label>Load (in Kg):</label>
      <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} className={emptyFields.includes('load') ? 'error' : null}/>

      <label>Reps:</label>
      <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} className={emptyFields.includes('reps') ? 'error' : null}/>

      <button>Add Workout</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}

export default WorkoutForm