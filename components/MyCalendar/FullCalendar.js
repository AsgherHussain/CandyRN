import React, { useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {
  Agenda,
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar
} from 'react-native-calendars'
import { Icon } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import CalendarIcon from '../../assets/svg/calendar.svg'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { SvgXml } from 'react-native-svg'
import moment from 'moment'
const _format = 'YYYY-MM-DD'

const FullCalendar = ({
  date,
  handleChange,
  selectedDates,
  _markedDates,
  setMarkedDates,
  setSelectdates,
  openCalendar
}) => {
  const refCalendar = useRef()

  const onDateChanged = date => {
    handleChange('date', date.dateString)
  }
  const onDaySelect = day => {
    let temp = [...selectedDates]
    const _selectedDay = moment(day.dateString).format(_format)

    let selected = true
    if (_markedDates[_selectedDay]) {
      delete temp[_selectedDay]
      selected = !_markedDates[_selectedDay].selected
    } else {
      temp.push(_selectedDay)
      setSelectdates(temp)
    }
    const updatedMarkedDates = {
      ..._markedDates,
      ...{
        [_selectedDay]: {
          selected,
          customStyles: {
            container: {
              backgroundColor: COLORS.white,
              borderWidth: selected ? 1 : 0,
              borderColor: COLORS.primary,
              borderRadius: 0
            },
            text: {
              color: COLORS.primary
            }
          }
        }
      }
    }

    getFilterByDates(updatedMarkedDates)

    setMarkedDates(updatedMarkedDates)
    handleChange('date', updatedMarkedDates)
  }

  const getFilterByDates = markedDates => {
    if (markedDates) {
      const dates = Object.keys(markedDates).filter(
        k => markedDates[k].selected === true
      )
      if (dates?.length > 0) {
        const sorted = dates?.sort(function (a, b) {
          return new Date(b) - new Date(a)
        })
        if (sorted.length === 1) {
          handleChange('min_date', moment(sorted[0]).format('YYYY-MM-DD'))
          handleChange('max_date', moment(sorted[0]).add(1, "days").format('YYYY-MM-DD'))
        } else if (sorted.length > 1) {
          for (let i = 0; i < sorted?.length; i++) {
            const element = dates[i]
            if (i === 0) {
              handleChange('max_date', moment(element).add(1, "days").format('YYYY-MM-DD'))
            }
            if (i === sorted.length - 1) {
              handleChange('min_date', moment(element).format('YYYY-MM-DD'))
            }
          }
        }
      } else {
        handleChange('min_date', '')
        handleChange('max_date', '')
      }
    }
  }

  const marked = useMemo(() => {
    return {
      [date]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: COLORS.primary,
        selectedTextColor: COLORS.white
      }
    }
  }, [date])

  return (
    <View style={styles.container}>
      {/* <View style={styles.row}>
        <View style={styles.rowDate}>
          <TouchableOpacity onPress={() => onChangeWeek('left')}>
            <Icon
              name='left'
              type='antdesign'
              color={COLORS.darkGrey}
              size={18}
            />
          </TouchableOpacity>
          <Text style={styles.date}>
            {moment(date).calendar(null, {
              sameDay: '[Today]',
              nextDay: '[Tomorrow]',
              nextWeek: 'dddd',
              lastDay: '[Yesterday]',
              lastWeek: '[Last] dddd',
              sameElse: 'DD/MM/YYYY'
            })}
          </Text>
          <TouchableOpacity onPress={() => onChangeWeek('right')}>
            <Icon
              size={18}
              name='right'
              type='antdesign'
              color={COLORS.darkGrey}
            />
          </TouchableOpacity>
        </View>
      </View> */}

      <Calendar
        ref={refCalendar}
        // renderHeader={() => <View style={{ height: 30 }} />}
        // current={date}
        // hideArrows
        maxDate={new Date()}
        firstDay={1}
        markingType={'custom'}
        theme={
          {
            // todayTextColor: COLORS.white,
            // todayBackgroundColor: COLORS.darkBlack
          }
        }
        enableSwipeMonths
        markedDates={_markedDates}
        onDayPress={onDaySelect}
        // theme={{
        //   'stylesheet.calendar.header': {
        //     header: {
        //       height: 0
        //     }
        //   }
        // }}
      />
      {/* <CalendarProvider
        date={date}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        disabledOpacity={0.6}
        // todayBottomMargin={16}
        >
        <ExpandableCalendar
          initialPosition={'open'}
          onCalendarToggled={isOpen => console.warn(isOpen)}
          // hideKnob
          // onDayPress={onDateChanged}
          ref={refCalendar}
          hideArrows
          markedDates={marked}
          renderHeader={() => <View />}
          firstDay={1}
        />
      </CalendarProvider> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10
  },
  date: {
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5),
    marginHorizontal: 10
  },
  row: {
    flexDirection: 'row',
    zIndex: 20,
    alignItems: 'center',
    width: '100%',
    paddingLeft: '5%',
    paddingRight: '10%',
    marginTop: 10,
    backgroundColor: COLORS.white,
    marginBottom: 10
  },
  rowDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  }
})

export default FullCalendar
