import React, { Component } from 'react';
import PropTypes from "prop-types";
import moment from 'moment';
import TetherComponent from 'react-tether';
import Calendar from './Calendar';
import classnames from 'classnames';
import MyTimePicker from './CustomTimePicker'

export const outsideClickIgnoreClass = 'ignore--click--outside'

export default class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    children: PropTypes.node,
    min: PropTypes.object,
    max: PropTypes.object,
    defaultMonth: PropTypes.object,
    inputFormat: PropTypes.string,
    pickerPosition: PropTypes.string,
    removable: PropTypes.bool,
    styles: PropTypes.object,
    calendarStyles: PropTypes.object,
    calendarContainerProps: PropTypes.object,
    timePicker: PropTypes.bool
  };

  static defaultProps = {
    styles: undefined,
    calendarContainerProps: {},
    timePicker: true
  };

  lastValueChange = null;

  state = {
    isOpen: false,
    momentValue: this.props.defaultValue || null,
    inputValue: this.getValue(this.props.defaultValue, this.props.timePicker),
    inputFormat: this.props.inputFormat || this.getInputFormat(this.props.timePicker),
    timePicker: this.props.timePicker,
    timePickerComponent: this.props.timePicker ? MyTimePicker : undefined
  };

  getInputFormat(timePicker) {
    if (!!timePicker)
      return 'YYYY/M/D hh:mm A';
    return 'YYYY/M/D';
  }

  getValue(inputValue, timePicker) {
    if (!inputValue)
      return '';
    const inputFormat = this.getInputFormat(timePicker);

    return inputValue.locale('en').format(this.props.inputFormat || inputFormat);
  }

  setOpen(isOpen) {
    this.setState({ isOpen });
  }

  componentWillMount() {
    if (this.props.value) {
      this.setMomentValue(this.props.value, false);
    }
  }

  componentWillReceiveProps(nextProps) {

    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setMomentValue(nextProps.value);
    }

    if ('timePicker' in nextProps && nextProps.timePicker !== this.props.timePicker) {
      this.setState({
        timePicker: nextProps.timePicker,
        timePickerComponent: this.props.timePicker ? MyTimePicker : undefined
      });
    }

  }

  handleChange() {
    const {momentValue} = this.state;
    if (!this.lastValueChange || !this.lastValueChange.valueOf) {
      this.lastValueChange = momentValue;
      this.props.onChange(momentValue);
      this.close();
      return;
    }

    if (momentValue.valueOf && momentValue.valueOf() !== this.lastValueChange.valueOf()) {
      this.lastValueChange = momentValue;
      this.props.onChange(momentValue);
      this.close();
    }
  }

  handleInputChangeOnEnter(event) {
    if(event.key === 'Enter') {
      return this.handleChange();
    }
  }

  setMomentValue(momentValue) {
    const {timePicker } = this.state;
    const inputValue = this.getValue(momentValue, timePicker);
    this.setState({ momentValue: moment(momentValue), inputValue });
  }

  handleFocus() {
    this.setOpen(true);
  }

  handleBlur(event) {
    const { onBlur } = this.props;
    const { isOpen } = this.state;

    if (isOpen) {
      this.refs.input.focus();
    } else {
      this.close();
      if (onBlur) {
        onBlur(event);
      }
    }
  }

  close() {
    const { value } = this.props;
    const { timePicker } = this.state;
    this.setState({inputValue: this.getValue(value, timePicker)});
    this.setOpen(false);
  }

  handleClickOutsideCalendar() {
    this.close();
  }

  handleSelectDay(selectedDay) {
    const { momentValue: oldValue } = this.state;
    let momentValue = selectedDay.clone();

    if (oldValue) {
      momentValue = momentValue
        .set({
          hour: oldValue.hours(),
          minute: oldValue.minutes(),
          second: oldValue.seconds()
        });
    }

    this.setMomentValue(momentValue);
  }

  handleInputChange(event) {
    const { inputFormat } = this.state;
    const inputValue = event.target.value;
    const momentValue = moment(inputValue, inputFormat);

    if (momentValue.isValid()) {
      this.setState({ momentValue });
    }

    this.setState({ inputValue });
  }

  handleInputClick() {
    if (!this.props.disabled) {
      this.setOpen(true)
    }
  }

  renderInput() {
    const { isOpen, inputValue } = this.state;

    const className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: isOpen
    });

    return (
      <div>
        <input
          className={`datepicker-input ${className}`}
          type="text"
          ref="input"
          onKeyUp={this.handleInputChangeOnEnter.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onChange={this.handleInputChange.bind(this)}
          onClick={this.handleInputClick.bind(this)}
          value={inputValue}
        />
      </div>
    );
  }

  renderCalendar() {
    const { momentValue, timePickerComponent: TimePicker } = this.state;
    const { min, max, defaultMonth, styles, calendarContainerProps} = this.props;

    return (
      <div>
        <Calendar
          min={min}
          max={max}
          selectedDay={momentValue}
          defaultMonth={defaultMonth}
          onSelect={this.handleSelectDay.bind(this)}
          onClickOutside={this.close.bind(this)}
          outsideClickIgnoreClass={outsideClickIgnoreClass}
          styles={styles}
          containerProps={calendarContainerProps}
        >
          <div className="picker-header">
            <div className="save-button-container">
              <button className="save-button" onClick={this.handleChange.bind(this)}>Save</button>
            </div>
            {
              TimePicker ? (
                <TimePicker
                  min={min}
                  max={max}
                  momentValue={momentValue}
                  setMomentValue={this.setMomentValue.bind(this)}
                />
              ) : <div className="time-picker-container"/>
            }
          </div>
        </Calendar>
      </div>
    );
  }

  removeDate() {
    this.setState({
      input: '',
      inputValue: ''
    });
  }

  render() {
    const { isOpen } = this.state;

    return (
      <TetherComponent className={this.props.wrapperClassName || ''} attachment={this.props.pickerPosition || 'top center'}>
        {this.renderInput()}
        {isOpen ? this.renderCalendar() : null}
      </TetherComponent>
    );
  }
}
