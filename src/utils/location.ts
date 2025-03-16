interface LocationInfo {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  areaCode: string;
}

const QQ_MAP_KEY = 'OZZBZ-FQLLN-4T4FI-SVGEM-UPV7F-O3BFA';

export async function getLocationInfo(latitude: number, longitude: number): Promise<LocationInfo> {
  try {
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${QQ_MAP_KEY}`;
    const response = await uni.request({
      url,
      method: 'GET'
    });

    if (response.statusCode === 200 && response.data.status === 0) {
      const result = response.data.result;
      const adInfo = result.ad_info;
      return {
        latitude,
        longitude,
        name: result.address,
        address: result.address_component.street_number,
        areaCode: adInfo.adcode
      };
    }
    throw new Error('获取地理位置信息失败');
  } catch (error) {
    console.error('获取地理位置信息出错:', error);
    throw error;
  }
}