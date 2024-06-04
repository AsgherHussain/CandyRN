export const getOrderColor = status => {
  const orderColorMapper = {
    Pending: {
      color: "#BB9B2B",
      bgColor: "#F4D054"
    },
    Unmatched: {
      color: "#D43232",
      bgColor: "#E65D5D"
    },
    Cancelled: {
      color: "#D43232",
      bgColor: "#E65D5D"
    }
  }

  return orderColorMapper[status] || orderColorMapper.Pending
}

export const hexToColorName = hexColor => {
  const colorMap = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#FF0000": "Red",
    "#00FF00": "Green",
    "#0000FF": "Blue"
    // Add more color hex codes and names as needed
  }

  return colorMap[hexColor] || ""
}

export const sumCancelledOrderTotal = orders => {
  return orders.reduce((sum, order) => {
    if (order.status === "Cancelled") {
      return sum + parseFloat(order.total)
    }
    return sum
  }, 0)
}
