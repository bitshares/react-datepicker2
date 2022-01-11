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

    const { momentValue } = this.state;
    if (momentValue && this.props.onChange) {
        this.handleChange(momentValue);
    }

    this.setState({ isOpen });
  }

  UNSAFE_componentWillMount() {
    if (this.props.value) {
      this.setMomentValue(this.props.value, false);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

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

  handleChange(value) {

      if (!this.lastValueChange || !this.lastValueChange.valueOf) {
          // console.log('change 1');
          this.lastValueChange = value;
          this.props.onChange(value);
          return;
      }

      if (value.valueOf && value.valueOf() !== this.lastValueChange.valueOf()) {
          // console.log('change 2');
          this.lastValueChange = value;
          this.props.onChange(value);
      }

  }

  setMomentValue(momentValue, doChange) {
    const { inputFormat, timePicker } = this.state;

    if (doChange !== false && this.props.onChange) {
      this.handleChange(momentValue);
    }

    // const inputValue = momentValue.format(inputFormat);

    const inputValue = this.getValue(momentValue, timePicker);

    this.setState({ momentValue, inputValue });
  }

  handleFocus() {
    this.setOpen(true);
  }

  handleBlur(ref,event) {
    const { onBlur } = this.props;
    const { isOpen, momentValue, inputFormat } = this.state;

    if (isOpen) {
      ref.current.focus();
    } else if (onBlur) {
      onBlur(event);
    }

    if (momentValue) {
      const inputValue = momentValue.format(inputFormat);
      this.setState({ inputValue });
    }
  }

  handleClickOutsideCalendar() {
    this.setOpen(false);
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

  renderInput(ref) {
    const { isOpen, inputValue } = this.state;

    const className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: isOpen
    });

    return (
      <div>
        <input
          className={`datepicker-input ${className}`}
          type="text"
          ref={ref}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this,ref)}
          onChange={this.handleInputChange.bind(this)}
          onClick={this.handleInputClick.bind(this)}
          value={inputValue}
        />
      </div>
    );
  }

  renderCalendar(ref) {
    const { momentValue, timePickerComponent: TimePicker } = this.state;
    const { onChange, min, max, defaultMonth, styles, calendarContainerProps } = this.props;

    return (
      <div ref={ref}>
        <Calendar
          min={min}
          max={max}
          selectedDay={momentValue}
          defaultMonth={defaultMonth}
          onSelect={this.handleSelectDay.bind(this)}
          onClickOutside={this.handleClickOutsideCalendar.bind(this)}
          outsideClickIgnoreClass={outsideClickIgnoreClass}
          styles={styles}
          containerProps={calendarContainerProps}
        >
          {
            TimePicker ? (
              <TimePicker
                min={min}
                max={max}
                momentValue={momentValue}
                setMomentValue={this.setMomentValue.bind(this)}
              />
            ) : null
          }
        </Calendar>
      </div>
    );
  }

  removeDate() {
    const { onChange } = this.props;
    if (onChange) {
      onChange('');
    }
    this.setState({
      input: '',
      inputValue: ''
    });
  }

  render() {
    const { isOpen } = this.state;

    return (
      <TetherComponent className={this.props.wrapperClassName || ''} attachment={this.props.pickerPosition || 'top center'}
        renderTarget={ref => this.renderInput(ref)}
        renderElement={ref => isOpen ? this.renderCalendar(ref) : null}
       />
    );
  }
}
