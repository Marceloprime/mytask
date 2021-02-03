import React, {Component} from 'react';
import {
    Modal,
    View, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    Text,
    TouchableOpacity,
    TextInput,
    Platform
} from 'react-native';

import moment from 'moment'
import commonStyles from '../commonStyles';
import DateTimePicker from '@react-native-community/datetimepicker'

const initialState = {desc:'', date: new Date(), showDatePicker: false}

export default class AddTask  extends Component{
    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date,
        }

        if(this.props.onSave){
            this.props.onSave(newTask)
        }

        this.setState({...initialState})
    }



    getDatePicker = () =>{
        let datePicker = <DateTimePicker 
            value={this.state.date}
            onChange={(_,date) => {this.setState({date, showDatePicker: false})}}
            mode='date' />
        
        if(this.state.date === undefined){
            this.state.date = initialState.date
        }

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')

        if(Platform.OS === 'android'){
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({showDatePicker: true})}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )

            
        }
        
        return datePicker
    }


    render(){
        return(
            <Modal transparent={true} visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType='slide'>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa</Text>
                    <TextInput placeholder='Descrição...' 
                        value={this.state.desc} onChangeText={desc => this.setState({desc})} style={styles.input} />
                    {this.getDatePicker()}
                    <View style={styles.bottons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.botton}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.botton}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container:{
        backgroundColor: '#fff'
    },
    header:{
        fontFamily: commonStyles.fontFamily,
        backgroundColor: '#B13B44',
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15, 
        fontSize: 18,
    }, 
    bottons:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    botton:{
        margin: 20,
        marginRight: 30,
        color: '#B13B44',
    },
    input:{
        fontFamily:  'Lato',
        width: '90%',
        height: 40,
        marginTop: 15,
        marginLeft: 10,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6

    },
    date:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 20
    }
})