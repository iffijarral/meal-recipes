import { useColorMode } from '@chakra-ui/react'
import React from 'react'

const Logo = () => {
    const { colorMode } = useColorMode();

    const fillColor = colorMode === 'dark' ? '#fff' : '000';
    return (
        <svg fill={fillColor} version="1.1" id="Capa_1"
            width="5rem" viewBox="0 0 164.921 164.921"
            >
            <g>
                <path d="M130.507,1.283c-0.517-0.796-1.392-1.277-2.334-1.283c-1.083,0-1.826,0.466-2.353,1.259
		c-2.232,3.379-21.811,33.39-21.844,46.252c-0.045,12.72,8.952,23.248,20.618,25.081c-0.097,20.684-12.115,38.572-29.503,47.234
		v-11.397c0-2.041-1.151-3.77-2.802-4.744V93.215c7.145-1.657,12.574-9.485,12.574-18.905c0-10.624-6.896-19.264-15.376-19.264
		c-8.473,0-15.363,8.64-15.363,19.264c0,9.42,5.428,17.248,12.56,18.905v10.469c-1.641,0.975-2.802,2.682-2.802,4.744v15.48
		c-3.961,0.952-8.083,1.51-12.344,1.51c-4.812,0-9.458-0.7-13.891-1.904v-15.069c0-2.058-1.158-3.776-2.802-4.749V92.356
		c7.639-1.336,13.473-7.978,13.473-15.989V60.359c0-1.546-1.268-2.802-2.801-2.802c-1.552,0-2.802,1.255-2.802,2.802v16.008
		c0,4.903-3.357,9.006-7.87,10.244V60.354c0-1.548-1.258-2.802-2.802-2.802c-1.552,0-2.802,1.253-2.802,2.802v26.258
		c-4.519-1.237-7.865-5.341-7.865-10.244V60.359c0-1.546-1.251-2.802-2.802-2.802c-1.541,0-2.803,1.255-2.803,2.802v16.008
		c0,8.011,5.833,14.643,13.469,15.989v11.339c-1.652,0.973-2.801,2.691-2.801,4.749v10.65
		c-16.636-8.974-27.959-26.553-27.959-46.728c0-29.262,23.803-53.065,53.056-53.065c9.522,0,18.867,2.556,27.022,7.379
		c1.322,0.78,3.041,0.353,3.84-0.979c0.801-1.335,0.35-3.048-0.985-3.839c-9.018-5.34-19.347-8.164-29.876-8.164
		c-32.348,0-58.66,26.317-58.66,58.668c0,23.359,13.757,43.516,33.563,52.942v34.002c0,3.098,2.505,5.604,5.603,5.604
		c3.101,0,5.604-2.506,5.604-5.604v-30.019c4.468,1.083,9.095,1.733,13.891,1.733c4.239,0,8.362-0.475,12.344-1.328v29.621
		c0,3.09,2.507,5.602,5.605,5.602c3.096,0,5.604-2.512,5.604-5.602v-33.267c20.529-9.045,34.931-29.494,35.098-53.289
		c12.178-1.127,21.82-11.767,21.853-24.84C152.075,35.048,132.716,4.701,130.507,1.283z M89.488,87.673
		c-0.308,0-0.593,0.088-0.877,0.176c-4.969-0.625-8.884-6.422-8.884-13.539c0-7.529,4.374-13.66,9.761-13.66
		c5.385,0,9.773,6.125,9.773,13.66c0,7.111-3.932,12.914-8.899,13.539C90.091,87.751,89.806,87.673,89.488,87.673z M130.745,67.081
		l0.011-4.531l9.271-7.296c1.214-0.958,1.421-2.717,0.458-3.934c-0.963-1.215-2.723-1.423-3.927-0.466l-5.78,4.545l0.022-5.374
		l9.269-7.298c1.215-0.961,1.424-2.721,0.459-3.936c-0.949-1.214-2.713-1.422-3.928-0.465l-5.776,4.55l0.02-8.5
		c0.011-1.546-1.247-2.801-2.791-2.808c0,0,0,0-0.011,0c-1.541,0-2.791,1.251-2.802,2.796l-0.022,8.752l-5.668-4.903
		c-1.172-1.004-2.934-0.892-3.951,0.287c-1.005,1.171-0.887,2.941,0.285,3.954l9.314,8.052l-0.023,5.144l-5.678-4.902
		c-1.173-1.002-2.946-0.879-3.953,0.297c-1.005,1.171-0.875,2.941,0.298,3.951l9.311,8.03l-0.01,4.017
		c-8.821-1.541-15.596-9.694-15.562-19.51c0.023-8.378,11.799-28.802,18.55-39.511c6.678,10.827,18.331,31.486,18.322,39.88
		C146.419,57.675,139.579,65.704,130.745,67.081z"/>
            </g>
        </svg>
    )
}

export default Logo