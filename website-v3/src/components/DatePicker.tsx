import dayjs, { Dayjs } from "dayjs";
import { Dispatch, useEffect, useState, SetStateAction } from "react";

const DatePicker: React.FC<{ time: Dayjs; setTime: Dispatch<SetStateAction<Dayjs>> }> = (props) => {
  const [dateString, setDateString] = useState(props.time.toDate().toLocaleString());
  useEffect(() => {
    setDateString(props.time.toDate().toLocaleString());
  }, [props.time]);

  return (
    <div>
      <label htmlFor='year'>year: </label>
      <input
        type='number'
        name='year'
        id='year'
        value={props.time.year()}
        onChange={(e) => {
          props.setTime(props.time.year(e.target.valueAsNumber || 0));
        }}
      />
      <label htmlFor='month'>month: </label>
      <input
        type='number'
        name='month'
        id='month'
        value={props.time.month() + 1}
        onChange={(e) => {
          props.setTime(props.time.month(e.target.valueAsNumber - 1 || 0));
        }}
      />
      <label htmlFor='day'>date: </label>
      <input
        type='number'
        name='day'
        id='day'
        value={props.time.date()}
        onChange={(e) => {
          props.setTime(props.time.date(e.target.valueAsNumber || 0));
        }}
      />
      <label htmlFor='hour'>hour: </label>
      <input
        type='number'
        name='hour'
        id='hour'
        value={props.time.hour()}
        onChange={(e) => {
          props.setTime(props.time.hour(e.target.valueAsNumber || 0));
        }}
      />
      <label htmlFor='minute'>minute: </label>
      <input
        type='number'
        name='minute'
        id='minute'
        value={props.time.minute()}
        onChange={(e) => {
          props.setTime(props.time.minute(e.target.valueAsNumber || 0));
        }}
      />
      <label htmlFor='second'>second: </label>
      <input
        type='number'
        name='second'
        id='second'
        value={props.time.second()}
        onChange={(e) => {
          props.setTime(props.time.second(e.target.valueAsNumber || 0));
        }}
      />
      <br />
      <button
        onClick={() => {
          const newDayJs = dayjs();
          props.setTime(newDayJs);
          setDateString(newDayJs.toDate().toLocaleString());
        }}>
        Reset
      </button>
      <br />
      {/* {props.time.toDate().toLocaleString()} */}
      <input
        type='text'
        value={dateString}
        onChange={(e) => {
          setDateString(e.target.value);
        }}
      />
      <button
        onClick={() => {
          const newDay = dayjs(new Date(dateString));
          props.setTime(newDay);
          setDateString(newDay.toDate().toLocaleString());
        }}>
        Change!
      </button>
    </div>
  );
};

export default DatePicker;
