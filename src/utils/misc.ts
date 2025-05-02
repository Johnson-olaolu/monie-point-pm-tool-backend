// import * as uniqid from 'uniqid';

// export function generateReference(userId?: string) {
//   const presentDate = moment().format('YYYYMMDD');
//   const paymentReference = uniqid(
//     `${process.env.PROJECT}_${userId}-`,
//     `-${presentDate}`,
//   ).toUpperCase();
//   return paymentReference;
// }

export function measureMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  return {
    rss: memoryUsage.rss, // Resident Set Size
    heapTotal: memoryUsage.heapTotal, // Total heap allocated
    heapUsed: memoryUsage.heapUsed, // Heap actually used
  };
}

export function isBcryptHash(str: string) {
  const bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
  return bcryptRegex.test(str);
}
