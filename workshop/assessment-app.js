import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system-view.js'
import ConsumerView from '../views/consumer-view.js'
import FailureView from '../views/failure-view.js'
import RiskView from '../views/risk-view.js'
import ServiceMetricView from '../views/service-metric-view.js'
import SummaryView from '../views/summary-view.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'

export const app = createApp({
    data() {
        const assessment = new Assessment()

        const apiServerSystem = new System(assessment, 'API server')
        apiServerSystem.addNewService('Car models API')
        apiServerSystem.addNewService('Car prices API')
        assessment.addSystem(apiServerSystem)

        const fileStorageSystem = new System(assessment, 'File storage')
        fileStorageSystem.addNewService('Store car images')
        fileStorageSystem.addNewService('Retrieve car images')
        fileStorageSystem.addNewService('Store car documents')
        fileStorageSystem.addNewService('Retrieve car documents')
        assessment.addSystem(fileStorageSystem)

        const webClientConsumer = new Consumer(assessment, 'Web client')
        webClientConsumer.addNewConsumption('Render car catalog page')
        webClientConsumer.addNewConsumption('Render car detail page')
        assessment.addConsumer(webClientConsumer)

        apiServerSystem.services[0].addNewFailure(
            webClientConsumer.consumptions[0],
            'Web page response is too slow',
            'User may leave',
            'Loss of potential customer',
        )
        const f1 = apiServerSystem.services[0].addNewFailure(
            webClientConsumer.consumptions[0],
            'Wrong car specs are shown to the user',
            'User will get the wrong info',
            'Legal responsibility, bad reputation',
        )
        const mobileClientConsumer = new Consumer(assessment, 'Mobile client')
        mobileClientConsumer.addNewConsumption('Render car image')
        mobileClientConsumer.addNewConsumption('Control the car remotely')
        assessment.addConsumer(mobileClientConsumer)

        fileStorageSystem.services[0].addNewFailure(
            webClientConsumer.consumptions[0],
            'Image is missing',
            'User will get confused and leave',
            'Loss of potential customer',
        )

        apiServerSystem.services[0].addNewMetric('Response time', 'How long it takes to respond to a request', f1)

        const tabNames = ['Start', 'Provider', 'Consumers', 'Failures', 'Risks', 'Metrics', 'Summary', 'Export']
        return {
            selectedTab: tabNames[5],
            tabNames,
            assessment,
            config,
        }
    },
    components: {
        SystemView,
        ConsumerView,
        FailureView,
        RiskView,
        ServiceMetricView,
        SummaryView,
        TabsComponent,
        ShowHideComponent,
        ExtLink,
    },
})