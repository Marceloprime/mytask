import { isMoment } from 'moment'
import React, {Component} from 'react'
import {
    View,
    Text,
    ImageBackground, 
    StyleSheet, 
    FlatList,
    TouchableOpacity, 
    Platform,
    Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage'

import commoStyle from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'

import moment from 'moment'
import 'moment/locale/pt-br'

import Task from '../components/Task'
import AddTask from './AddTask'

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks:[]
}

export default class TaskList extends Component{
    state = {
        ...initialState
    }

    toggleFilter = () => {
        this.setState({showDoneTasks: ! this.state.showDoneTasks}, this.filterTasks)
    }

    componentDidMount = async () => {
        this.filterTasks()
        const stateString = await AsyncStorage.getItem('tasksState')
        console.log(stateString)
        const state = JSON.parse(stateString) || initialState
        this.setState(state, this.filterTasks)
    }

    filterTasks = async () =>{
        let visibleTasks = null

        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks]
        }
        else{
            const pending = task => task.doneAt === null 
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({visibleTasks})
        console.log('Antes'+this.state)
        await AsyncStorage.setItem('tasksState',JSON.stringify(this.state))
        const stateString = await AsyncStorage.getItem('tasksState')
        console.log('Depois'+stateString)

    }


    toggleTask = taskId =>{
        const tasks = [...this.state.tasks]

        tasks.forEach(task => {
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({tasks : tasks}, this.filterTasks)
    }

    addTask = (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados invalidos', 'Descrição não informada!')
            return
        }

        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({tasks : tasks,showAddTask : false}, this.filterTasks)
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id)
        this.setState({tasks}, this.filterTasks)
    }

    render(){
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')
        return(
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({showAddTask: false}) }/>
                <ImageBackground style={styles.background} source={todayImage}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon  name={this.state.showDoneTasks ? 'eye': 'eye-slash'}
                            size={30} color={commoStyle.colors.secondary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle} >{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskContainer}>
                    <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask} onDelete={this.deleteTask}/>}
                    />
                </View>
                <TouchableOpacity style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => this.setState({showAddTask: true})}>
                    <Icon name="plus" size={20} color={'#FFF'}></Icon>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    background:{
        flex: 3
    },
    taskContainer:{
        flex: 7
    },
    titleBar:{
        flex: 1,
        justifyContent: 'flex-end'
    },
    title:{
        fontFamily: commoStyle.fontFamily,
        color: commoStyle.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    }, 
    subtitle:{
        fontFamily: commoStyle.fontFamily,
        color: commoStyle.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar:{
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS ==='ios' ? 40 : 20

    },
    addButton:{
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commoStyle.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})