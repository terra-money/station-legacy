export default (v = '') => (v ? v.replace(/[^\d.]/g, '') : '')
