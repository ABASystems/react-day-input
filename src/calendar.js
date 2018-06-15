import React from 'react'
import moment from 'moment'
import classNames from 'classnames'

class CalendarDay extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = ::this.handleClick;
  }

  handleClick() {
    this.props.onChange(this.props.day.format('x'));
  }

  render() {
    return (
      <div
        className={classNames('day', {
          'in-month': this.props.inMonth,
          'selected': this.props.selected,
          'highlighted': typeof this.props.highlight == 'function' && this.props.highlight(this.props.day.format('x'))
        })}
        onClick={this.handleClick}
      >
        <span className="number">{this.props.day.format('D')}</span>
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = ::this.handleChange;
  }

  handleChange(newValue) {
    if (this.props.disabled) {
      return;
    }
    this.props.onChange(newValue);
  }

  render() {
    var firstMonthDay = moment([this.props.year, this.props.month, 1]);
    var firstDay = firstMonthDay.clone().startOf('week');

    var weeks = [];
    var day = firstDay.clone();
    while (day.month() == this.props.month || day.month() == firstDay.month()) {
      var days = [];
      while (days.length < 7) {
        days.push(
          <CalendarDay
            key={`day-${day.format('x')}`}
            day={day.clone()}
            inMonth={(day.month() == this.props.month)}
            selected={(day.format('x') === this.props.value)}
            onChange={this.handleChange}
            highlight={this.props.dayHighlight}
          />
        );
        day.add(1, 'days');
      }
      weeks.push(
        <div
          className={classNames('week')}
          key={`week-${day.format('x')}`}
        >
          {days}
        </div>
      );
    }

    let weekLabels = []
    let firstWeekDay = moment().startOf('week')
    let weekDay = 0
    while (weekDay < 7) {
      weekLabels.push(
        <div>
          {firstWeekDay.clone().add({days: weekDay}).format(this.props.weekdayFormat)}
        </div>
      )
      weekDay++
    }

    return (
      <div className={classNames('rendered-react-day-input-calendar', {
        hidden: !this.props.open,
        'right-mounted': this.props.rightMounted,
      })}>
        <div className="header">
          <div className="button" onClick={this.props.previousMonth}>Prev</div>
          <div className="title">{firstMonthDay.format('MMMM YYYY')}</div>
          <div className="button" onClick={this.props.nextMonth}>Next</div>
        </div>
        <div className="day-labels">
          {weekLabels}
        </div>
        {weeks}
      </div>
    );
  }
}
Calendar.defaultProps = {
  rightMounted: false,
  weekdayFormat: 'ddd',
};

export default Calendar
