import request from '@/utils/request'

export const getCarousel = () => {
  return request.get('/product/carousel/list')
}

// 获得商品spu分页
export const getProductSpuPage = async (data: any) => {
  return await request.post('/product/spu/page', data)
}

// 获得商品大类
export const getCategory = () => {
  return request.get(`/product/category/list`)
}

// 获得商品树形列表
export const getCategoryTree = () => {
  return request.get(`/product/category/listTree`)
}

// 获得商品分类列表
export const getSpuDetail = (id: any) => {
  return request.get(`/product/spu/get-detail?id=8`)
}

export const getDetail = () => {
  return request.get('/product/category/list')
}