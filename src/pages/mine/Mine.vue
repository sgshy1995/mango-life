<template>
	<view>
		<view class="mine-top-back">
			<u-status-bar></u-status-bar>
			<view class="mine-top-back-one"></view>
			<view class="mine-top-back-two"></view>
			<view class="mine-top-back-three"></view>
		</view>
		<view class="mine-info-title">
			<view class="mine-info-title-in">我的</view>
			<view class="mine-info-title-icon" @click="handleShowUserInfo">
				<u-icon name="setting" color="#fff" size="24"></u-icon>
			</view>
		</view>
		<view class="mine-top">
			<view class="mine-top-one">
				<view v-if="userInfo.id" class="left" @click="showAvatarView">
					<u-avatar class="user-avatar" color="#ccc" :src="baseUrl + '/' + userInfo.avatar" size="60"
						fontSize="50" bg-color="#f6f6f6"></u-avatar>
				</view>
				<view v-else class="left" @click="handleLoginOrRegister">
					<u-avatar class="user-avatar" color="#ccc" icon="account-fill" size="60" fontSize="50"
						bg-color="#f6f6f6"></u-avatar>
				</view>
				<view class="right">
					<view class="right-one">{{ userInfo.nickname }}</view>
					<view class="right-two">ID: {{ userInfo.primary_key.split('-')[0] }}</view>
					<view class="right-three">IP属地: {{ ipLocation }}</view>
				</view>
			</view>
		</view>
		<view class="mine-body">
			<view class="mine-default-radio">
				<view class="mine-default-radio-title">默认展开模块</view>
				<u-radio-group @change="handleChangeRadio" v-model="radioDefaultValue" iconPlacement="left">
					<u-radio iconSize="12" labelSize="12" activeColor="#ffbb00" label="不展开  " name="none"></u-radio>
					<u-radio iconSize="12" labelSize="12" activeColor="#ffbb00" label="图片管理  " name="picture"></u-radio>
					<u-radio iconSize="12" labelSize="12" activeColor="#ffbb00" label="油价查询  " name="gas"></u-radio>
					<u-radio iconSize="12" labelSize="12" activeColor="#ffbb00" label="实时天气  " name="weather"></u-radio>
				</u-radio-group>
			</view>
			<view class="mine-pictures" v-if="userInfo.id">
				<u-collapse ref="collapse" @change="changeCollapse" @close="closeCollapse" @open="openCollapse"
					accordion :value="valueCollapse">
					<u-collapse-item title="个人图片管理" icon="https://eden-life.net.cn:9000/cdn/mango/images/图片管理.png"
						name="picture">
						<view class="u-collapse-content">
							<view class="mine-pictures-title">上传和更改您的个人图片</view>
							<u-line></u-line>
							<view class="picture-item">
								<view class="upload">
									<u-icon name="camera-fill" @click="uploadBackground" color="#333" size="24">
									</u-icon>
									<image v-if="info.money_background" :src="baseUrl + '/' + info.money_background"
										@click="showMoneyBackgroundView"></image>
									<u-icon v-if="info.money_background" name="trash" @click="showModalBackground=true"
										color="#333" size="16"></u-icon>
								</view>
								<view class="tip">
									<view>记账页面背景图片</view>
									<view>推荐像素: 375*750</view>
								</view>
							</view>
							<u-line></u-line>
							<view class="picture-item">
								<view class="upload">
									<u-icon name="camera-fill" @click="uploadAvatar" color="#333" size="24"></u-icon>
									<image v-if="info.money_avatar" :src="baseUrl + '/' + info.money_avatar"
										@click="showMoneyAvatarView"></image>
									<u-icon v-if="info.money_avatar" name="trash" @click="showModalAvatar=true"
										color="#333" size="16"></u-icon>
								</view>
								<view class="tip">
									<view>记账页面头像</view>
									<view>推荐像素: 100*100</view>
								</view>
							</view>
							<u-line></u-line>
						</view>
					</u-collapse-item>
					<u-collapse-item title="油价查询" :icon="gasIcon" name="gas">
						<view class="u-collapse-content">
							<view class="u-collapse-content-in">
								<view class="u-collapse-content-in-top">
									<text>当前省份： </text>
									<view class="u-collapse-content-in-top-text">
										<text>{{ inProvince ? inProvince : '暂未获取到省份信息' }}</text>
									</view>
									<view @click="reGetLocationInfo" class="u-collapse-content-in-top-select">
										<text>重新定位</text>
										<u-icon name="map" color="#999" size="10"></u-icon>
									</view>
									<view @click="handleShowProvincePicker" class="u-collapse-content-in-top-select">
										<text>选择其他省份</text>
										<u-icon name="arrow-right" color="#999" size="10"></u-icon>
									</view>
								</view>
								<view class="u-collapse-content-in-bottom">
									<view class="content-in-table">
										<!-- 表头行 -->
										<view class="content-in-table-head">
											<view class="content-in-table-head-th">地区</view>
											<view class="content-in-table-head-th">92号汽油</view>
											<view class="content-in-table-head-th">95号汽油</view>
											<view class="content-in-table-head-th">98号汽油</view>
											<view class="content-in-table-head-th last-th">0号柴油</view>
										</view>
										<!-- 表格数据行 -->
										<view class="content-in-table-body" v-if="gasInfo.province && !gasLoading">
											<view class="content-in-table-body-td">{{ gasInfo.province }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas92 }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas95 }}</view>
											<view class="content-in-table-body-td">{{ gasInfo.gas98 }}</view>
											<view class="content-in-table-body-td last-th">{{ gasInfo.gas0 }}</view>
										</view>
										<view class="content-in-table-body-loading" v-if="gasLoading">
											<u-loading-icon text="加载中" size="12" textSize="12"></u-loading-icon>
										</view>
										<view class="content-in-table-body-empty"
											v-if="!gasInfo.province && !gasLoading">
											<image class="body-empty-img" src="@/static/images/days/nothing.png">
											</image>
											<text class="body-empty-text">暂无信息~</text>
										</view>
									</view>
								</view>
								<view class="u-collapse-content-in-top">油价动态</view>
								<view class="u-collapse-content-in-footer">
									<text class="u-collapse-content-in-footer-normal"
										v-if="!gasDynamicInfo.normal && !gasDynamicInfo.dynamic">--</text>
									<text class="u-collapse-content-in-footer-normal"
										v-if="gasDynamicInfo.normal">{{ gasDynamicInfo.normal }}</text>
									<text class="u-collapse-content-in-footer-red"
										v-if="gasDynamicInfo.dynamic">{{ gasDynamicInfo.dynamic }}</text>
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-collapse-item title="实时天气" :icon="weatherIcon" name="weather">
						<view class="u-collapse-content">
							<view class="u-collapse-weather-title">
								<u-icon name="map-fill" color="#333" size="18"></u-icon>
								<text class="u-collapse-weather-title-text">{{ weatherInfo.area ? weatherInfo.province + weatherInfo.city + weatherInfo.area : '位置错误' }}</text>
								<view class="u-collapse-weather-title-re" @click="reGetWeatherInfo">
									{{ weatherLoading ? '定位中...' : '定位有误？重新定位' }}
								</view>
							</view>
							<view class="u-collapse-weather-body">
								<!-- <text @click="handleChooseCity">点击选择</text> -->
								<view class="u-collapse-weather-body-update">
									更新时间： {{ weatherInfoNow.obsTime || '--' }}
								</view>
								<view class="u-collapse-weather-body-top">
									<view class="body-top-left">
										<view class="body-top-left-left">
											<view class="left-temp">
												<view class="left-temp-num">{{ weatherInfoNow.temp || '--' }}</view>
												<view class="left-temp-text"> ℃</view>
											</view>
											<view class="left-text">
												{{ weatherInfoNow.text || '--' }}
												<view class="left-text-precip" v-if="weatherInfoNow.precip && Number(weatherInfoNow.precip)">降雨量 {{ weatherInfoNow.precip }} mm/h</view>
											</view>
											<view class="left-feel">
												<image class="left-feel-img" src="@/static/images/mine/temperature.png"></image>
												<text class="left-feel-text">体感温度 {{ weatherInfoNow.feelsLike || '--' }} ℃</text>
											</view>
										</view>
										<view class="body-top-left-right">
											<view class="right-wind">
												<image class="right-wind-img" src="@/static/images/mine/wind.png"></image>
												<text class="right-wind-dir">{{ weatherInfoNow.windDir || '--' }}</text>
												<text class="right-wind-scale">{{ weatherInfoNow.windScale || '--' }}级</text>
											</view>
											<view class="right-wet">
												<image class="right-wet-img" src="@/static/images/mine/wet.png"></image>
												<text class="right-wet-text">湿度 {{ weatherInfoNow.humidity || '--' }}%</text>
											</view>
										</view>
									</view>
									<view class="body-top-right">
										<image class="body-top-right-img" v-if="weatherInfoNow.icon && Number(weatherInfoNow.temp) <= -10" :src="require(`@/static/images/mine/weather-1/${weatherInfoNow.icon}-fill.png`)"></image>
										<image class="body-top-right-img" v-if="weatherInfoNow.icon && Number(weatherInfoNow.temp) > -10 && Number(weatherInfoNow.temp) <= 5" :src="require(`@/static/images/mine/weather-2/${weatherInfoNow.icon}-fill.png`)"></image>
										<image class="body-top-right-img" v-if="weatherInfoNow.icon && Number(weatherInfoNow.temp) > 5 && Number(weatherInfoNow.temp) <= 20" :src="require(`@/static/images/mine/weather-3/${weatherInfoNow.icon}-fill.png`)"></image>
										<image class="body-top-right-img" v-if="weatherInfoNow.icon && Number(weatherInfoNow.temp) > 20" :src="require(`@/static/images/mine/weather-4/${weatherInfoNow.icon}-fill.png`)"></image>
									</view>
								</view>
								<view class="u-collapse-weather-body-daily">
									<view class="u-collapse-weather-body-daily-title">
										未来24小时
									</view>
									<view class="u-collapse-weather-body-daily-body">
										<view class="u-collapse-weather-body-daily-body-in" v-if="weatherDailyList && weatherDailyList.length">
											<view class="daily-item" v-for="(u,index) in weatherDailyList" :key="index">
												<view class="daily-item-fxTime">{{ u.fxTime ? `${u.fxTime}时` : '--' }}</view>
												<image class="daily-item-img" v-if="u.icon && Number(u.temp) <= -10" :src="require(`@/static/images/mine/weather-1/${u.icon}-fill.png`)"></image>
												<image class="daily-item-img" v-if="u.icon && Number(u.temp) > -10 && Number(u.temp) <= 5" :src="require(`@/static/images/mine/weather-2/${u.icon}-fill.png`)"></image>
												<image class="daily-item-img" v-if="u.icon && Number(u.temp) > 5 && Number(u.temp) <= 20" :src="require(`@/static/images/mine/weather-3/${u.icon}-fill.png`)"></image>
												<image class="daily-item-img" v-if="u.icon && Number(u.temp) > 20" :src="require(`@/static/images/mine/weather-4/${u.icon}-fill.png`)"></image>
												<view class="daily-item-text">
													<view class="daily-item-text-in">{{ u.text || '--' }}</view>
													<view class="daily-item-text-pop" v-if="u.pop && Number(u.pop) && u.precip && Number(u.precip)">降水率 {{ u.pop || '--' }}%</view>
													<view class="daily-item-text-precip" v-if="u.precip && Number(u.precip)">降水量 {{ u.precip || '--' }}mm</view>
												</view>
												<view class="daily-item-temp">
													{{ u.temp || '--' }} ℃
												</view>
											</view>
										</view>
										<view class="u-collapse-weather-body-daily-body-empty" v-else>
											<image class="u-collapse-weather-body-daily-body-empty-img" src="@/static/images/days/nothing.png">
											</image>
											<text class="u-collapse-weather-body-daily-body-empty-text">暂无信息~</text>
										</view>
									</view>
								</view>
								<view class="u-collapse-weather-body-content">
									<view class="u-collapse-weather-body-content-title">
										未来7天
									</view>
									<view class="u-collapse-weather-body-content-body">
										<view class="u-collapse-weather-body-content-body-in" v-if="weatherD7List && weatherD7List.length">
											<view class="daily-item" v-for="(u,index) in weatherD7List" :key="index" :class="{'last-one': index === weatherD7List.length - 1}">
												<view class="daily-item-left">
													<view class="daily-item-left-top">
														<view class="top-time">
															<text class="top-time-day">{{ u.fxDate }}</text>
															<text class="top-time-week" v-if="u.week">{{ u.week }}</text>
														</view>
														<view class="top-temp">
															<image class="top-temp-img" src="@/static/images/mine/temperature.png"></image>
															<text class="top-temp-text">{{ `${u.tempMin || '--'}℃ ~ ${u.tempMax || '--'}℃` }}</text>
														</view>
													</view>
													<view class="daily-item-left-bottom">
														<view class="right-wind">
															<image class="right-wind-img" src="@/static/images/mine/wind.png"></image>
															<text class="right-wind-dir">{{ weatherInfoNow.windDir || '--' }}</text>
															<text class="right-wind-scale">{{ weatherInfoNow.windScale || '--' }}级</text>
														</view>
														<view class="right-wet">
															<image class="right-wet-img" src="@/static/images/mine/wet.png"></image>
															<text class="right-wet-text">湿度 {{ weatherInfoNow.humidity || '--' }}%</text>
														</view>
													</view>
												</view>
												<view class="daily-item-right">
													<view class="daily-item-right-img-wrapper">
														<image class="daily-item-right-img" v-if="u.iconDay && Number(u.tempMax) <= -10" :src="require(`@/static/images/mine/weather-1/${u.iconDay}-fill.png`)"></image>
														<image class="daily-item-right-img" v-if="u.iconDay && Number(u.tempMax) > -10 && Number(u.tempMax) <= 5" :src="require(`@/static/images/mine/weather-2/${u.iconDay}-fill.png`)"></image>
														<image class="daily-item-right-img" v-if="u.iconDay && Number(u.tempMax) > 5 && Number(u.tempMax) <= 20" :src="require(`@/static/images/mine/weather-3/${u.iconDay}-fill.png`)"></image>
														<image class="daily-item-right-img" v-if="u.iconDay && Number(u.tempMax) > 20" :src="require(`@/static/images/mine/weather-4/${u.iconDay}-fill.png`)"></image>
														<text class="daily-item-right-gang">/</text>
														<image class="daily-item-right-img-night" v-if="u.iconNight && Number(u.tempMin) <= -10" :src="require(`@/static/images/mine/weather-1/${u.iconNight}-fill.png`)"></image>
														<image class="daily-item-right-img-night" v-if="u.iconNight && Number(u.tempMin) > -10 && Number(u.tempMin) <= 5" :src="require(`@/static/images/mine/weather-2/${u.iconNight}-fill.png`)"></image>
														<image class="daily-item-right-img-night" v-if="u.iconNight && Number(u.tempMin) > 5 && Number(u.tempMin) <= 20" :src="require(`@/static/images/mine/weather-3/${u.iconNight}-fill.png`)"></image>
														<image class="daily-item-right-img-night" v-if="u.iconNight && Number(u.tempMin) > 20" :src="require(`@/static/images/mine/weather-4/${u.iconNight}-fill.png`)"></image>
													</view>
													
													<view class="daily-item-right-text">
														<view class="daily-item-text-in">
															<text class="daily-item-text-in-day">{{ u.textDay || '--' }}</text>
															<text class="daily-item-text-in-gang"> / </text>
															<text class="daily-item-text-in-night">{{ u.textNight || '--' }}</text>
														</view>
														<view class="daily-item-text-pop" v-if="u.pop && Number(u.pop) && u.precip && Number(u.precip)">降水率 {{ u.pop || '--' }}%</view>
														<view class="daily-item-text-precip" v-if="u.precip && Number(u.precip)">降水量 {{ u.precip || '--' }}mm</view>
													</view>
												</view>
											</view>
										</view>
										<view class="u-collapse-weather-body-content-body-empty" v-else>
											<image class="u-collapse-weather-body-daily-body-empty-img" src="@/static/images/days/nothing.png">
											</image>
											<text class="u-collapse-weather-body-daily-body-empty-text">暂无信息~</text>
										</view>
									</view>
								</view>
							</view>
							<view class="u-collapse-weather-from">
								数据来源: 和风天气开发平台
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>

			<view class="mine-assistant">

			</view>
		</view>
		<image-cropper :crop-width="200" :crop-height="200" :show-reset-btn="false" :show-rotate-btn="false"
			:src="tempAvatarFilePath" @confirm="confirmAvatar" @cancel="cancelAvatar"></image-cropper>
		<u-modal :show="showModalBackground" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyBackground"
			@cancel="showModalBackground=false" content="确定删除记账页面背景图片并还原默认吗？"></u-modal>
		<u-modal :show="showModalAvatar" showCancelButton confirmColor="#ffbb00" @confirm="deleteMoneyAvatar"
			@cancel="showModalAvatar=false" content="确定删除记账页面头像并还原默认吗？"></u-modal>
		<u-picker confirmColor="#ffbb00" @cancel="cancelProvince" :key="pickerKey" :show="showProvince"
			:defaultIndex="defaultIndex" :columns="columnsProvince" @confirm="confirmProvince"></u-picker>
		<u-picker keyName="name" @change="changeHandlerCity" ref="cityPicker" confirmColor="#ffbb00" @cancel="cancelCity" :show="showCity" :defaultIndex="defaultIndexCity"
			:columns="columnsCity" @confirm="confirmCity"></u-picker>
	</view>
</template>

<script>
	import Vue from 'vue';
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction,
		moneyAvatarUploadAction,
		moneyBackgroundUploadAction,
		getInfoByUserIdAction,
		updateInfoByUserIdAction,
		getGasInfoByProvinceAction,
		getWeatherInfoByCityAction,
		getPCAListAction
	} from '@/service/service'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	import moment from 'moment';
	export default Vue.extend({
		data() {
			return {
				gasLoading: false,
				pickerKey: 0,
				loadingTable: false,
				baseUrl: process.env.VUE_APP_API_BASE_URL,
				showType: 'login',
				showPopup: false,
				showCity: false,
				userInfo: {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: '',
					team_id: 0,
					team_name: ''
				},
				tempAvatarFilePath: '',
				cropAvatarFilePath: '',
				tempBackgroundFilePath: '',
				cropBackgroundFilePath: '',
				info: {
					id: 0,
					money_avatar: '',
					money_background: '',
					user_id: 0
				},
				valueCollapse: '',
				showModalBackground: false,
				showModalAvatar: false,
				ipLocation: '',
				lifeIcon: require('@/static/images/mine/ass.png'),
				gasIcon: require('@/static/images/mine/gas.png'),
				weatherIcon: require('@/static/images/mine/weather.png'),
				inProvince: '',
				gasInfo: {
					province: '',
					gas92: '',
					gas95: '',
					gas98: '',
					gas0: ''
				},
				gasDynamicInfo: {
					normal: '',
					dynamic: ''
				},
				showProvince: false,
				columnsProvince: [
					['北京', '上海', '江苏', '天津', '河北', '山东', '重庆', '江西', '辽宁', '安徽', '内蒙古', '福建', '宁夏', '甘肃', '青海',
						'广东', '广西', '山西', '贵州', '陕西', '海南', '四川', '西藏', '河南', '新疆', '黑龙江', '吉林', '云南', '湖北',
						'浙江', '湖南'
					]
				],
				columnsCity: [[],[],[]],
				defaultIndex: [0],
				defaultIndexCity: [0],
				readyLoadLocation: false,
				radioDefaultValue: 'gas',
				weatherInfo: {
					province: '',
					city: '',
					area: ''
				},
				weatherInfoNow: {},
				weatherDailyList: [],
				weatherD7List: [],
				pcaList: [],
				weatherLoading: false
			};
		},
		components: {
			ImageCropper
		},
		onShow() {
			if (uni.getStorageSync('SYS_SUCCESS_USER_INFO')) {
				this.userInfo = uni.getStorageSync('SYS_SUCCESS_USER_INFO')
				uni.removeStorageSync('SYS_SUCCESS_USER_INFO')
			}
			//(this.$refs.Form! as any).setRules(this.formRules)
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				this.userInfo = uni.getStorageSync('SYS_USER_INFO')
				console.log('this.userInfo', this.userInfo)
			}
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.getUserInfo(this.userInfo)
			} else {
				this.userInfo = {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: '',
					team_id: 0,
					team_name: ''
				}
			}
			this.getIpInfo()
			this.getLocationInfo()
		},
		onLoad() {
			if (uni.getStorageSync('SYS_MINE_DEFAULT_SHOW')) {
				this.radioDefaultValue = uni.getStorageSync('SYS_MINE_DEFAULT_SHOW')
			}
			this.valueCollapse = this.radioDefaultValue
			this.getPCAJson()
		},
		methods: {
			handleChooseCity(){
				this.showCity = true
			},
			handleChangeRadio(type) {
				this.radioDefaultValue = type
				uni.setStorageSync('SYS_MINE_DEFAULT_SHOW', type)
			},
			handleShowProvincePicker() {
				this.showProvince = true
			},
			cancelProvince() {
				this.showProvince = false
			},
			cancelCity() {
				this.showCity = false
			},
			confirmProvince(e) {
				console.log('confirm', e)
				this.inProvince = e.value[0]
				this.showProvince = false
				this.getGasInfo(true)
			},
			confirmCity(e) {
				console.log('confirm', e)
				this.showCity = false
			},
			changeHandlerCity(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.cityPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				const firstRow = this.pcaList.map(item=>{
					return {
						name: item.name,
						code: item.code
					}
				})
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					console.log('columnIndex',columnIndex)
					console.log('value',value)
					console.log('values',values)
					console.log('index',index)
					//picker.setColumnValues(1, [{name: value}])
					
					const secondRow = this.pcaList.find(item=>item.code === values[0][index].code).children.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					picker.setColumnValues(1, secondRow)
					const thirdRow = this.pcaList.find(item=>item.code === values[0][index].code).children.find(item=>item.code === secondRow[0].code).children.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					picker.setColumnValues(2, thirdRow)
				}else if (columnIndex === 1) {
					// picker为选择器this实例，变化第二列对应的选项
					console.log('columnIndex',columnIndex)
					console.log('value',value)
					console.log('values',values)
					console.log('index',index)
					//picker.setColumnValues(1, [{name: value}])
					
					const thirdRow = this.pcaList.find(item=>{return item.children.find(itemIn=>itemIn.code === values[1][index].code)}).children[index].children.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					picker.setColumnValues(2, thirdRow)
				}
			},
			getLocationInfo(ifLoading) {
				const that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						console.log('当前位置的res：', res);
						if (!that.readyLoadLocation) {
							that.inProvince = that.columnsProvince[0].find(name => res.address.province
								.indexOf(name) > -1)
							that.defaultIndex = [that.columnsProvince[0].findIndex(name => res.address
								.province.indexOf(name) > -1)]
							that.pickerKey++
							that.readyLoadLocation = true
						}
						that.getGasInfo(ifLoading)
						that.weatherInfo.province = res.address.province
						that.weatherInfo.city = res.address.city
						that.weatherInfo.area = res.address.district
						that.getWeatherInfo(ifLoading)
					}
				});
			},
			reGetWeatherInfo(){
				if(this.weatherLoading) return
				this.getLocationInfo(true)
			},
			getWeatherInfo(ifLoading){
				const province = this.pcaList.find(item=>item.name.indexOf(this.weatherInfo.province)>-1 || this.weatherInfo.province.indexOf(item.name)>-1)
				const provinceIndex = this.pcaList.findIndex(item=>item.name.indexOf(this.weatherInfo.province)>-1 || this.weatherInfo.province.indexOf(item.name)>-1)
				console.log('province', province)
				
				if(province){
					const city = this.pcaList[provinceIndex].children.find(item=>item.name.indexOf(this.weatherInfo.city)>-1 || this.weatherInfo.city.indexOf(item.name)>-1)
					const cityIndex = this.pcaList[provinceIndex].children.findIndex(item=>item.name.indexOf(this.weatherInfo.city)>-1 || this.weatherInfo.city.indexOf(item.name)>-1)
					console.log('city', city)
					
					if(city){
						const area = this.pcaList[provinceIndex].children[cityIndex].children.find(item=>item.name.indexOf(this.weatherInfo.area)>-1 || this.weatherInfo.area.indexOf(item.name)>-1)
						const areaIndex = this.pcaList[provinceIndex].children[cityIndex].children.find(item=>item.name.indexOf(this.weatherInfo.area)>-1 || this.weatherInfo.area.indexOf(item.name)>-1)
						
						console.log('area', area)
						if(area){
							if(ifLoading) this.weatherLoading = true
							getWeatherInfoByCityAction(area.code).then(res=>{
								this.weatherInfoNow = res.data.now
								this.weatherInfoNow.obsTime = this.weatherInfoNow.obsTime ? moment(this.weatherInfoNow.obsTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : ''
								this.weatherDailyList = res.data.daily || []
								this.weatherDailyList.map(item=>{
									item.fxTime = item.fxTime ? new Date(item.fxTime).getHours().toString() : ''
								})
								this.weatherD7List =  res.data.d7 || []
								const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
								this.weatherD7List.map(item=>{
									item.week = item.fxDate ? weeks[new Date(item.fxDate).getDay()] : ''
								})
								this.$nextTick(() => {
									this.$refs.collapse.init()
								})
								if(ifLoading) this.weatherLoading = false
							}).catch(err=>{
								if(ifLoading) this.weatherLoading = false
							})
						}
						
					}
				}
				
				//getWeatherInfoByCityAction()
			},
			reGetLocationInfo() {
				this.readyLoadLocation = false
				this.getLocationInfo(true)
			},
			getGasInfo(ifLoading) {
				if (ifLoading) this.gasLoading = true
				getGasInfoByProvinceAction(this.inProvince).then(res => {
					console.log('油价 res', res)
					this.gasInfo = res.data.gasInfo
					this.gasDynamicInfo = res.data.gasDynamicInfo
					this.gasLoading = false
					this.$nextTick(() => {
						this.$refs.collapse.init()
					})
				}).catch(err => {
					this.gasInfo = {
						province: '',
						gas92: '',
						gas95: '',
						gas98: '',
						gas0: ''
					}
					this.gasDynamicInfo = {
						normal: '',
						dynamic: ''
					}
					this.gasLoading = false
					this.$nextTick(() => {
						this.$refs.collapse.init()
					})
				})
			},
			getIpInfo() {
				uni.request({
					url: 'http://pv.sohu.com/cityjson?ie=utf-8',
					method: 'POST',
					success: (res) => {
						console.log('ip res ====', res)
						console.log(res.data.split('var returnCitySN = ')[1])
						const jsonData = res.data.split('var returnCitySN = ')[1]
						if (jsonData) {
							this.ipLocation = JSON.parse(jsonData).cname
						}
					}
				})
			},
			getPCAJson() {
				getPCAListAction().then(res => {
					this.pcaList = res.data || []
					const firstRow = this.pcaList.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					this.$refs.cityPicker.setColumnValues(0, firstRow)
					const secondRow = this.pcaList.find(item=>item.code === firstRow[0].code).children.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					this.$refs.cityPicker.setColumnValues(1, secondRow)
					const thirdRow = this.pcaList.find(item=>item.code === firstRow[0].code).children.find(item=>item.code === secondRow[0].code).children.map(item=>{
						return {
							name: item.name,
							code: item.code
						}
					})
					this.$refs.cityPicker.setColumnValues(2, thirdRow)
				})
			},
			getUserInfo(userInfo) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						//this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						this.$store.dispatch('setUserInfo', this.userInfo)
						getInfoByUserIdAction(this.userInfo).then(res => {
							this.info = res.data
						})
						reslove()
					}).catch(() => {
						this.userInfo = {
							username: '',
							nickname: '',
							primary_key: '',
							id: 0,
							email: '',
							phone: '',
							avatar: '',
							team_id: 0,
							team_name: ''
						}
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
			handleShowUserInfo() {
				console.log('show111111111')
				const that = this
				uni.navigateTo({
					url: "/pages-mine/userInfo",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
				//(this.$refs.UserInfoWrapper as any).showPopup = true;
			},
			handleLoginOrRegister() {
				uni.navigateTo({
					url: "/pages-mine/loginRegister"
				})
				//(this.$refs.LoginRegisterWrapper as any).showPopup = true;
				//(this.$refs.LoginRegisterWrapper as any).tapCaptcha();
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			},
			openCollapse(e) {
				// console.log('open', e)
				this.valueCollapse = e
			},
			closeCollapse(e) {
				// console.log('close', e)
			},
			changeCollapse(e) {
				// console.log('change', e)
			},
			uploadBackground() {
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						moneyBackgroundUploadAction(imgUrl).then(res => {
							console.log('res', res)
							this.$toast(res.message || '上传成功')
							getInfoByUserIdAction(this.userInfo).then(res => {
								this.info = res.data
							})
							this.$emit('change')
						}).catch(err => {
							console.log('err', err)
						})
					}.bind(this)
				})
			},
			uploadAvatar() {
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						that.tempAvatarFilePath = imgUrl
					}.bind(this)
				})
			},
			confirmAvatar(e) {
				this.cropAvatarFilePath = e.detail.tempFilePath
				moneyAvatarUploadAction(this.cropAvatarFilePath).then(res => {
					console.log('res', res)
					this.$toast(res.message || '上传成功')
					this.tempAvatarFilePath = ''
					this.cropAvatarFilePath = ''
					getInfoByUserIdAction(this.userInfo).then(res => {
						this.info = res.data
					})
					this.$emit('change')
				}).catch(err => {
					console.log('err', err)
				})
			},
			cancelAvatar() {
				this.tempAvatarFilePath = ''
			},
			showAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.userInfo.avatar],
					indicator: 'none'
				});
			},
			showMoneyAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_avatar],
					indicator: 'none'
				});
			},
			showMoneyBackgroundView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + '/' + this.info.money_background],
					indicator: 'none'
				});
			},
			deleteMoneyBackground() {
				updateInfoByUserIdAction(this.userInfo.id, {
					money_background: ''
				}).then(res => {
					this.$toast(res.message || '更新成功')
					this.showModalBackground = false
					getInfoByUserIdAction(this.userInfo).then(res => {
						this.info = res.data
					})
				})
			},
			deleteMoneyAvatar() {
				updateInfoByUserIdAction(this.userInfo.id, {
					money_avatar: ''
				}).then(res => {
					this.$toast(res.message || '更新成功')
					this.showModalAvatar = false
					getInfoByUserIdAction(this.userInfo).then(res => {
						this.info = res.data
					})
				})
			}
		}
	})
</script>

<style lang="scss">
	.mine-body {
		box-sizing: border-box;
		padding: 30rpx;

		.mine-default-radio {
			margin-top: 24rpx;
			margin-bottom: 12rpx;

			.mine-default-radio-title {
				font-size: 12px;
				margin-bottom: 12rpx;
				font-weight: 700;
			}

			.u-radio-group .u-radio {
				margin-right: 24rpx !important;
			}
		}

		.mine-pictures {
			width: 100%;
			box-sizing: border-box;
			border-left: 1px solid #EAEBEC;
			border-right: 1px solid #EAEBEC;
			margin-top: 24rpx;

			.u-collapse-weather-title {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;
				width: 100%;

				.u-collapse-weather-title-text {
					font-size: 14px;
					font-weight: 700;
					padding-left: 24rpx;
					color: #333;
					padding-right: 24rpx;
				}
				
				.u-collapse-weather-title-re{
					font-size: 14px;
					color: #333;
					text-decoration: underline;
				}
			}
			
			.u-collapse-weather-from{
				font-size: 10px;
				color: #999;
				margin-top: 24rpx;
				width: 100%;
				white-space: nowrap;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}

			.u-collapse-weather-body {
				width: 100%;
				
				.u-collapse-weather-body-update{
					font-size: 12px;
					margin-top: 12rpx;
					width: 100%;
				}
				
				.u-collapse-weather-body-content{
					width: 100%;
					margin-top: 24rpx;
					border-top: 1px solid #eee;
					box-sizing: border-box;
					padding-top: 24rpx;
					
					.u-collapse-weather-body-content-title{
						width: 100%;
						font-size: 14px;
						font-weight: 700;
					}
					
					.u-collapse-weather-body-content-body{
						margin-top: 24rpx;
						box-sizing: border-box;
						
						.u-collapse-weather-body-content-body-empty {
							width: 100%;
							height: 300rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;
						
							.u-collapse-weather-body-daily-body-empty-text {
								font-size: 12px;
								color: #cdcdcd;
							}
						
							.u-collapse-weather-body-daily-body-empty-img {
								width: 54rpx;
								height: 54rpx;
								margin-left: 12rpx;
							}
						}
						
						.u-collapse-weather-body-content-body-in{
							width: 100%;
							
							.daily-item{
								width: 100%;
								display: flex;
								align-items: center;
								box-sizing: border-box;
								padding: 24rpx;
								margin-bottom: 24rpx;
								border-radius: 24rpx;
								box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
								
								&.last-one{
									margin-bottom: 0;
								}
								
								.daily-item-left{
									width: 60%;
									
									.daily-item-left-top{
										width: 100%;
										
										.top-time{
											font-size: 14px;
											font-weight: 700;
											margin-bottom: 24rpx;
											display: flex;
											align-items: center;
											
											.top-time-week{
												padding-left: 24rpx;
											}
										}
										
										.top-temp{
											display: flex;
											align-items: center;
											
											.top-temp-img{
												width: 32rpx;
												height: 32rpx;
												margin-right: 12rpx;
											}
											.top-temp-text{
												font-size: 14px;
												font-weight: 700;
											}
										}
									}
									
									.daily-item-left-bottom{
										width: 100%;
										margin-top: 24rpx;
										
										.right-wind{
											font-size: 12px;
											display: flex;
											align-items: center;
											
											.right-wind-img{
												width: 24rpx;
												height: 24rpx;
												margin-right: 12rpx;
											}
											
											.right-wind-dir{
												margin-right: 12rpx;
											}
										}
										
										.right-wet{
											font-size: 12px;
											display: flex;
											align-items: center;
											margin-top: 24rpx;
											
											.right-wet-img{
												width: 24rpx;
												height: 24rpx;
												margin-right: 12rpx;
											}
										}
									}
								}
								
								.daily-item-right{
									width: 40%;
									display: flex;
									align-items: center;
									justify-content: center;
									flex-direction: column;
									
									.daily-item-right-img-wrapper{
										display: flex;
										align-items: flex-end;
										margin-bottom: 24rpx;
										
										.daily-item-right-img{
											width: 48rpx;
											height: 48rpx;
											margin-right: 12rpx;
										}
										
										.daily-item-right-img{
											font-size: 14px;
										}
										
										.daily-item-right-img-night{
											width: 32rpx;
											height: 32rpx;
											margin-left: 12rpx;
										}
									}
									
									.daily-item-right-text{
										display: flex;
										justify-content: center;
										align-items: center;
										flex-direction: column;
										
										.daily-item-text-in{
											margin-bottom: 12rpx;
											display: flex;
											align-items: flex-end;
											
											.daily-item-text-in-day{
												font-size: 18px;
												font-weight: 700;
												white-space: nowrap;
											}
											
											.daily-item-text-in-gang{
												font-size: 14px;
												font-weight: 700;
												margin-left: 12rpx;
												margin-right: 12rpx;
											}
											
											.daily-item-text-in-night{
												font-size: 14px;
												font-weight: 700;
												white-space: nowrap;
											}
										}
										
										.daily-item-text-pop{
											font-size: 12px;
											white-space: nowrap;
										}
										
										.daily-item-text-precip{
											font-size: 12px;
											white-space: nowrap;
										}
									}
								}
							}
						}
					}
				}
				
				.u-collapse-weather-body-daily{
					width: 100%;
					margin-top: 24rpx;
					border-top: 1px solid #eee;
					box-sizing: border-box;
					padding-top: 24rpx;
					
					.u-collapse-weather-body-daily-title{
						width: 100%;
						font-size: 14px;
						font-weight: 700;
					}
					
					.u-collapse-weather-body-daily-body{
						margin-top: 24rpx;
						box-sizing: border-box;
						
						.u-collapse-weather-body-daily-body-empty {
							width: 100%;
							height: 300rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;
						
							.u-collapse-weather-body-daily-body-empty-text {
								font-size: 12px;
								color: #cdcdcd;
							}
						
							.u-collapse-weather-body-daily-body-empty-img {
								width: 54rpx;
								height: 54rpx;
								margin-left: 12rpx;
							}
						}
						
						.u-collapse-weather-body-daily-body-in{
							width: 100%;
							display: flex;
							align-items: center;
							box-sizing: border-box;
							padding: 12rpx;
							overflow-x: scroll;
							
							.daily-item{
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								margin-right: 32rpx;
								
								.daily-item-fxTime{
									font-size: 12px;
									font-weight: 700;
									white-space: nowrap;
								}
								
								.daily-item-img{
									margin-top: 12rpx;
									width: 32rpx;
									height: 32rpx;
								}
								
								.daily-item-text{
									display: flex;
									align-items: center;
									justify-content: center;
									flex-direction: column;
									font-size: 12px;
									margin-top: 12rpx;
									
									.daily-item-text-in{
										white-space: nowrap;
									}
									
									.daily-item-text-pop{
										margin-top: 12rpx;
										white-space: nowrap;
										font-size: 10px;
									}
									
									.daily-item-text-precip{
										margin-top: 6rpx;
										white-space: nowrap;
										font-size: 10px;
									}
								}
								
								.daily-item-temp{
									margin-top: 12rpx;
									font-size: 14px;
									font-weight: 700;
									white-space: nowrap;
								}
							}
						}
					}
				}
				
				.u-collapse-weather-body-top{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 24rpx;
					
					.body-top-left{
						display: flex;
						
						.body-top-left-left{
							color: #333;
							.left-temp{
								display: flex;
								align-items: flex-end;

								.left-temp-num{
									font-size: 28px;
									font-weight: 700;
									margin-right: 6rpx;
								}
								.left-temp-text{
									font-size: 16px;
								}
							}
							.left-text{
								font-size: 14px;
								font-weight: 700;
								margin-top: 24rpx;
								
								.left-text-precip{
									font-size: 12px;
									margin-top: 12rpx;
									font-weight: normal;
								}
							}
							.left-feel{
								display: flex;
								align-items: center;
								font-size: 12px;
								margin-top: 24rpx;
								
								.left-feel-img{
									width: 24rpx;
									height: 24rpx;
									margin-right: 12rpx;
								}
							}
						}
						
						.body-top-left-right{
							color: #333;
							
							.right-wind{
								font-size: 14px;
								display: flex;
								align-items: center;
								
								.right-wind-img{
									width: 24rpx;
									height: 24rpx;
									margin-right: 12rpx;
								}
								
								.right-wind-dir{
									margin-right: 12rpx;
								}
							}
							
							.right-wet{
								font-size: 14px;
								display: flex;
								align-items: center;
								margin-top: 24rpx;
								
								.right-wet-img{
									width: 24rpx;
									height: 24rpx;
									margin-right: 12rpx;
								}
							}
						}
					}
					
					.body-top-right{
						margin-right: 24rpx;
						.body-top-right-img{
							width: 64rpx;
							height: 64rpx;
						}
					}
				}
			}

			.u-collapse-content-title {
				display: flex;
				align-items: center;
				margin-bottom: 24rpx;

				.u-collapse-content-title-icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}

				.u-collapse-content-title-text {
					font-size: 14px;
					font-weight: 700;

				}
			}

			.u-collapse-content-in {
				width: 100%;

				.u-collapse-content-in-top {
					font-size: 13px;
					margin-bottom: 24rpx;
					display: flex;
					align-items: center;

					.u-collapse-content-in-top-text {
						display: flex;
						font-weight: 700;
						margin-left: 12rpx;
						align-items: center;
					}

					.u-collapse-content-in-top-select {
						display: flex;
						font-size: 10px;
						box-sizing: border-box;
						padding: 2rpx 6rpx;
						border-radius: 4rpx;
						border: 1px solid #999;
						margin-left: 24rpx;
					}
				}

				.u-collapse-content-in-footer {
					width: 100%;
					font-size: 13px;

					.u-collapse-content-in-footer-normal {
						color: #333;
					}

					.u-collapse-content-in-footer-red {
						color: #E06C75;
					}
				}

				.u-collapse-content-in-bottom {
					width: 100%;
					margin-bottom: 24rpx;

					.content-in-table {
						width: 100%;

						.content-in-table-head {
							width: 100%;
							display: flex;
							align-items: center;

							.content-in-table-head-th {
								width: 20%;
								box-sizing: border-box;
								border-top: 1px solid #999;
								border-bottom: 1px solid #999;
								border-left: 1px solid #999;
								font-size: 12px;
								height: 60rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								&.last-th {
									border-right: 1px solid #999;
								}
							}
						}

						.content-in-table-body {
							width: 100%;
							display: flex;
							align-items: center;

							.content-in-table-body-td {
								width: 20%;
								box-sizing: border-box;
								border-bottom: 1px solid #999;
								border-left: 1px solid #999;
								font-size: 12px;
								height: 60rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								&.last-th {
									border-right: 1px solid #999;
								}
							}
						}

						.content-in-table-body-empty {
							width: 100%;
							height: 60rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;

							.body-empty-text {
								font-size: 10px;
								color: #cdcdcd;
							}

							.body-empty-img {
								width: 36rpx;
								height: 36rpx;
								margin-left: 12rpx;
							}
						}

						.content-in-table-body-loading {
							width: 100%;
							height: 60rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border-bottom: 1px solid #999;
							border-left: 1px solid #999;
							border-right: 1px solid #999;
						}

					}
				}
			}

			.mine-pictures-title {
				font-size: 12px;
				padding-bottom: 14rpx;
			}

			.picture-item {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				justify-content: space-between;
				padding: 14rpx;

				.upload {
					display: flex;
					align-items: center;

					image {
						width: 60rpx;
						height: 60rpx;
						border-radius: 10rpx;
						margin-left: 24rpx;
						margin-right: 24rpx;
					}
				}

				.tip {
					view {
						text-align: right;
						font-size: 13px;

						&:last-child {
							font-size: 12px;
							color: #9699a0;
						}
					}

				}
			}
		}

		.mine-assistant {
			width: 100%;
			margin-top: 24rpx;
		}
	}

	.mine-top-back {
		width: 100%;
		height: 400rpx;
		position: relative;
		background-image: linear-gradient(180deg, #ffbb00 0%, rgba(255, 187, 0, 0.7) 100%);

		.mine-top-back-one {
			width: 320rpx;
			height: 320rpx;
			position: absolute;
			left: -50rpx;
			top: -50rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 2;
		}

		.mine-top-back-two {
			width: 220rpx;
			height: 220rpx;
			position: absolute;
			bottom: 0;
			left: 140rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 1;
		}

		.mine-top-back-three {
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			right: 120rpx;
			bottom: 120rpx;
			border-radius: 50%;
			background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
			z-index: 1;
		}
	}

	.mine-info-title {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: -280rpx;
		margin-bottom: 128rpx;
		position: relative;
		z-index: 3;

		.mine-info-title-in {
			font-size: 18px;
			font-weight: 800;
			color: #fff;
		}

		.mine-info-title-icon {
			position: absolute;
			right: 24rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.mine-top {
		width: 100%;
		height: 220rpx;
		background: transparent;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 3;

		.mine-top-one {
			box-sizing: border-box;
			width: 84%;
			height: 220rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #fff;
			border-radius: 24rpx;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
			position: relative;

			.left {
				display: flex;
				align-items: center;
				align-items: center;
				position: absolute;
				left: 50%;
				top: 0;
				transform: translate(-50%, -50%);

				.u-avatar {
					border: 2px solid #fff !important;
					background: #fff !important;
				}
			}

			.right {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.right-one {
					font-size: 16px;
					font-weight: 800;
					margin-top: 24rpx;
					white-space: nowrap;
					margin-bottom: 6rpx;
				}

				.right-two {
					font-size: 10px;
					color: #888;
					white-space: nowrap;
				}

				.right-three {
					font-size: 10px;
					color: #888;
					white-space: nowrap;
				}
			}
		}

		.mine-top-two {
			box-sizing: border-box;
			width: 100%;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;
				border-radius: 10rpx;
				background: #fff;

				text {
					color: #333;
					padding-right: 10rpx;
					font-size: 12px;
				}
			}
		}
	}
</style>
