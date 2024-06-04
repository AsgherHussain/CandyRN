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
import i18n from '../../i18n'

const MyCalendar = ({ date, handleChange, openCalendar }) => {
  const refCalendar = useRef()

  const onDateChanged = date => {
    handleChange('date', date)
  }

  const onMonthChange = (/* month, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
  }

  const onChangeWeek = type => {
    if (type === 'left') {
      refCalendar?.current?.contentRef?.onPressArrowLeft()
    } else {
      refCalendar?.current?.contentRef?.onPressArrowRight()
    }
  }

  const handleOpen = () => {
    handleChange('openCalendar', 'open')
  }

  const marked = useMemo(() => {
    return {
      [date]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: COLORS.primary04,
        selectedTextColor: COLORS.darkBlack
      }
    }
  }, [date])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={handleOpen}>
          <SvgXml xml={CalendarIcon} />
        </TouchableOpacity>
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
              sameDay: `[${i18n.t('Today')}]`,
              nextDay: `[${i18n.t('Tomorrow')}]`,
              nextWeek: `dddd`,
              lastDay: `[${i18n.t('Yesterday')}]`,
              lastWeek: `[${i18n.t('Last')}] dddd`,
              sameElse: `DD/MM/YYYY`
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
      </View>
      <CalendarProvider
        date={date}
        style={{ zIndex: -1 }}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        disabledOpacity={0.6}
        // todayBottomMargin={16}
      >
        <ExpandableCalendar
          initialPosition={'closed'}
          hideKnob
          ref={refCalendar}
          hideArrows
          style={{ marginTop: -20, zIndex: -1 }}
          renderHeader={() => <View style={{ height: 30 }} />}
          firstDay={1}
          markedDates={marked}
        />
      </CalendarProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
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
    justifyContent: 'center',
    width: '95%'
  }
})

export default MyCalendar
